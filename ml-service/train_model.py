import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.metrics import classification_report, accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
import joblib
import os

# Create models directory
os.makedirs('models', exist_ok=True)

# ================ BINARY CLASSIFICATION ================
print("\n🔄 Loading binary dataset...")
df_bin = pd.read_csv("data/hepatitis_binary.csv")
X_bin = df_bin.drop("Hepatitis", axis=1)
y_bin = df_bin["Hepatitis"]

Xb_train, Xb_test, yb_train, yb_test = train_test_split(
    X_bin, y_bin, test_size=0.2, stratify=y_bin, random_state=42
)

binary_models = {
    "Binary Logistic Regression": Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("model", LogisticRegression(max_iter=3000, class_weight="balanced"))
    ]),
    "Binary SVM": Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("model", SVC(kernel="rbf", probability=True, class_weight="balanced"))
    ]),
    "Binary Random Forest": Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("model", RandomForestClassifier(
            n_estimators=300, max_depth=15, 
            class_weight="balanced", random_state=42
        ))
    ]),
    "Binary Gradient Boosting": Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("model", GradientBoostingClassifier(
            n_estimators=250, learning_rate=0.05, 
            max_depth=5, random_state=42
        ))
    ])
}

binary_results = {}
print("\n================ BINARY MODEL RESULTS ================\n")
for name, model in binary_models.items():
    model.fit(Xb_train, yb_train)
    y_pred = model.predict(Xb_test)
    acc = accuracy_score(yb_test, y_pred)
    binary_results[name] = acc
    print(f"{name}")
    print(f"Accuracy: {acc:.4f}")
    print(classification_report(yb_test, y_pred))

best_binary = max(binary_results, key=binary_results.get)
joblib.dump(binary_models[best_binary], "models/best_binary_model.pkl")
joblib.dump(X_bin.columns.tolist(), "models/binary_features.pkl")
print(f"\n✅ Best Binary Model: {best_binary} ({binary_results[best_binary]:.4f})")

# ================ MULTICLASS CLASSIFICATION ================
print("\n🔄 Loading multiclass dataset...")
df_multi = pd.read_csv("data/hepatitis_multiclass.csv")

# Remove leakage features
LEAKAGE_FEATURES = ["HBV_DNA_Positive", "HCV_RNA_Positive"]
X_multi = df_multi.drop(columns=["Hepatitis_Type"] + LEAKAGE_FEATURES, errors='ignore')
y_multi = df_multi["Hepatitis_Type"]

Xm_train, Xm_test, ym_train, ym_test = train_test_split(
    X_multi, y_multi, test_size=0.2, stratify=y_multi, random_state=42
)

multiclass_models = {
    "Multi SVM": Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("scaler", StandardScaler()),
        ("model", SVC(
            kernel="rbf", C=0.25, gamma=0.09, 
            probability=True, class_weight="balanced"
        ))
    ]),
    "Multi Random Forest": Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("model", RandomForestClassifier(
            n_estimators=300, max_depth=15, min_samples_leaf=5,
            class_weight="balanced", random_state=42
        ))
    ]),
    "Multi Gradient Boosting": Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("scaler", StandardScaler()),
        ("model", GradientBoostingClassifier(
            n_estimators=120, learning_rate=0.1, 
            max_depth=3, subsample=0.8, random_state=42
        ))
    ])
}

multi_results = {}
print("\n================ MULTICLASS MODEL RESULTS ================\n")
for name, model in multiclass_models.items():
    model.fit(Xm_train, ym_train)
    y_pred = model.predict(Xm_test)
    acc = accuracy_score(ym_test, y_pred)
    multi_results[name] = acc
    print(f"{name}")
    print(f"Accuracy: {acc:.4f}")
    print(classification_report(ym_test, y_pred))

best_multi = max(multi_results, key=multi_results.get)
joblib.dump(multiclass_models[best_multi], "models/best_multiclass_model.pkl")
joblib.dump(X_multi.columns.tolist(), "models/multiclass_features.pkl")
print(f"\n✅ Best Multiclass Model: {best_multi} ({multi_results[best_multi]:.4f})")

# ================ FINAL SUMMARY ================
print("\n================ FINAL SUMMARY ================\n")
print("Binary Models Accuracy:")
for k, v in sorted(binary_results.items(), key=lambda x: x[1], reverse=True):
    print(f"{k:30s} : {v:.4f}")

print("\nMulticlass Models Accuracy:")
for k, v in sorted(multi_results.items(), key=lambda x: x[1], reverse=True):
    print(f"{k:30s} : {v:.4f}")

print("\n✅ Models saved successfully!")
print("   - models/best_binary_model.pkl")
print("   - models/best_multiclass_model.pkl")
print("   - models/binary_features.pkl")
print("   - models/multiclass_features.pkl")
