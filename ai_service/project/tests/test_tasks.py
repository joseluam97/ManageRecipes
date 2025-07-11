from ai_service.project.tasks import create_task

def test_home(test_app):
    response = test_app.get("/")
    assert response.status_code == 200

def test_task():
    assert create_task.run(1)
    assert create_task.run(2)
    assert create_task.run(3)