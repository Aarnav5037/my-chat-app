from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Load model once when backend starts
model_name = "mistralai/Mistral-7B-Instruct-v0.3"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto"
)

def generate_reply(user_message, max_new_tokens=150):
    """
    Generate a response from Mistral 7B Instruct.
    """
    prompt = f"User: {user_message}\nAssistant:"
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            do_sample=True,
            top_p=0.9,
            temperature=0.7
        )

    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    reply = response[len(prompt):].strip()
    return reply
