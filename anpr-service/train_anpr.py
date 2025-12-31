from ultralytics import YOLO
import torch
import os

def main():
    # Define dataset path
    data_path = "/Users/apple/Downloads/Arabic License plates.v1i.yolov8/data.yaml"
    
    # Check if data.yaml exists
    if not os.path.exists(data_path):
        print(f"Error: data.yaml not found at {data_path}")
        return

    print(f"Starting training with dataset: {data_path}")
    print(f"Device: {'mps' if torch.backends.mps.is_available() else 'cpu'}")

    # Load a model
    # We use yolov8n.pt for a good balance of speed and accuracy for ANPR
    model = YOLO("yolov8n.pt") 

    # Train the model
    results = model.train(
        data=data_path,
        epochs=100,  # Training for 100 epochs
        imgsz=640,
        project="runs/train",
        name="arabic_plates_model",
        device="mps" if torch.backends.mps.is_available() else "cpu",
        plots=True
    )
    
    print("Training completed successfully!")
    print(f"Best model saved at: runs/train/arabic_plates_model/weights/best.pt")

if __name__ == "__main__":
    main()
