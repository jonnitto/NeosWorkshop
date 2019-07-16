.PHONY: default

default:
	@echo ""
	@echo ""
	@echo "      Usage: make COMMAND"
	@echo ""
	@echo "--- DEPLOY & RELEASE -----------------------------------------------------"
	@echo ""
	@echo "    install     Install project on Uberspace"
	@echo "    ssh         Connect to the host directly into the correct folder"
	@echo "    deploy      Deploy project"
	@echo "    release     Build files, commit & push them to git and deploy project"
	@echo "    rollback    Rollback to the previous working release"
	@echo ""
	@echo ""

# deploy & release
.PHONY: ssh install deploy release rollback commit
ssh:
	dep ssh

install:
	dep install

deploy:
	dep deploy

release:
	dep yarn
	dep deploy:tag
	dep deploy

rollback:
	dep rollback

commit:
	git add .
	git commit -m ":arrow_up: Update"
	git push
