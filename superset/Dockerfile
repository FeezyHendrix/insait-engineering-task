FROM apache/superset:latest

USER root

# Install required packages
RUN pip install psycopg2-binary redis flask-cors
# Create directory for custom config
RUN mkdir -p /app/pythonpath

# Set environment variable to tell Superset where to find config
ENV PYTHONPATH=/app/pythonpath:$PYTHONPATH
ENV SUPERSET_CONFIG_PATH=/app/pythonpath/superset_config.py

USER superset