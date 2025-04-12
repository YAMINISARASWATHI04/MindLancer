# matcher.py

from sentence_transformers import SentenceTransformer, util

# Load the pre-trained Sentence-BERT model only once
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text):
    """
    Generate the sentence embedding for the given text.
    """
    return model.encode(text, convert_to_tensor=True)

def calculate_similarity(text1, text2):
    """
    Compute cosine similarity between two pieces of text.
    """
    embedding1 = get_embedding(text1)
    embedding2 = get_embedding(text2)
    similarity_score = util.pytorch_cos_sim(embedding1, embedding2).item()
    return round(similarity_score, 3)

def match_freelancers_to_project(freelancers, project_description):
    """
    Match freelancers to a given project description based on semantic similarity.
    
    Args:
        freelancers (list): List of freelancer dicts with 'name', 'skills', 'experience', and 'portfolio'.
        project_description (str): The job/project description text.

    Returns:
        List of tuples: [(freelancer_name, match_score), ...]
    """
    project_embedding = get_embedding(project_description)
    results = []

    for freelancer in freelancers:
        profile_text = f"{freelancer['skills']} {freelancer['experience']} {freelancer['portfolio']}"
        freelancer_embedding = get_embedding(profile_text)
        score = util.pytorch_cos_sim(project_embedding, freelancer_embedding).item()
        results.append((freelancer['name'], round(score, 3)))

    results.sort(key=lambda x: x[1], reverse=True)
    return results
