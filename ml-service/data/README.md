# Dataset Directory

Place your hepatitis dataset files here.

## Supported Formats

- CSV files (.csv)
- Excel files (.xlsx, .xls)
- JSON files (.json)

## Expected Dataset Structure

Your dataset should have the following columns:

### Required Features:
1. `Age` - Patient age (numeric)
2. `Gender` - 0 for Female, 1 for Male
3. `Total_Bilirubin` - Total bilirubin level (mg/dL)
4. `Direct_Bilirubin` - Direct bilirubin level (mg/dL)
5. `Alkaline_Phosphotase` - Alkaline phosphatase level (U/L)
6. `Alamine_Aminotransferase` - ALT/SGPT level (U/L)
7. `Aspartate_Aminotransferase` - AST/SGOT level (U/L)
8. `Total_Protiens` - Total proteins (g/dL)
9. `Albumin` - Albumin level (g/dL)
10. `Albumin_and_Globulin_Ratio` - A/G Ratio

### Target Variable:
- `Target` or `Class` or `Result` - 0 for Live/Healthy, 1 for Die/Disease

## Example Files

Place your dataset file here with one of these names:
- `hepatitis_data.csv`
- `hepatitis_dataset.csv`
- `indian_liver_patient.csv`
- Or any custom name (update train_model.py accordingly)

## Sample CSV Format

```csv
Age,Gender,Total_Bilirubin,Direct_Bilirubin,Alkaline_Phosphotase,Alamine_Aminotransferase,Aspartate_Aminotransferase,Total_Protiens,Albumin,Albumin_and_Globulin_Ratio,Target
65,1,0.7,0.1,187,16,18,6.8,3.3,0.90,0
62,1,10.9,5.5,699,64,100,7.5,3.2,0.74,1
47,1,0.9,0.2,136,88,56,6.8,3.4,1.00,0
```

## Popular Hepatitis Datasets

1. **Indian Liver Patient Dataset (ILPD)**
   - Available on Kaggle and UCI ML Repository
   - 583 patient records
   - 10 features + target

2. **Hepatitis Dataset (UCI)**
   - Classic hepatitis dataset
   - 155 instances
   - 19 attributes

## After Adding Dataset

1. Update `train_model.py` to load your dataset:
   ```python
   df = pd.read_csv('data/your_dataset.csv')
   ```

2. Retrain the model:
   ```bash
   py train_model.py
   ```

3. The new model will be saved automatically
