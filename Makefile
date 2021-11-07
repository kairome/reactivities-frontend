build-image:
	docker build -t reactivities-frontend .

test-run:
	 docker run -it --rm -p 8585:3000 --name reactivities-frontend-test reactivities-frontend
