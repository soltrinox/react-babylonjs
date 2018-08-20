const { fullPath, caption } = getTargetName(__filename);
const target = require(fullPath);

const setup = () => setupTest(caption, target, { mocksToEnable: ["babylon"] });

describe(caption, function() {
    testHelpers.includeComponentExportTests(setup, { type: "actionManager" });

    describe("create", function() {
        setup();

        it("should call BABYLON.ActionManager", function() {
            const { context, symbolByType } = this.mocks;
            const component = this.target.createComponent(context, {});

            sinon.assert.calledOnce(context.BABYLON.ActionManager);

            sinon.assert.calledWithExactly(
                context.BABYLON.ActionManager,
                context.scene
            );

            expect(component)
                .to.be.an("object")
                .to.have.property("type", symbolByType["ActionManager"]);
        });
    });

    describe("setter", function() {
        setup();

        it("should register the action", function() {
            const { sandbox } = this;
            const action = { id: "123-#actions-123" };
            const component = {
                registerAction: sandbox.stub(),
                actions: [],
            };

            this.target.props.OnPickTrigger.setter(component, {
                action,
                toRemove: false,
            });

            sinon.assert.calledOnce(component.registerAction);
            sinon.assert.calledWithExactly(component.registerAction, action);
        });

        it("should unregister the action", function() {
            const { sandbox } = this;
            const action = { id: "123-#actions-123" };
            const component = {
                unregisterAction: sandbox.stub(),
            };

            this.target.props.OnPickTrigger.setter(component, {
                action,
                toRemove: true,
            });

            sinon.assert.calledOnce(component.unregisterAction);
            sinon.assert.calledWithExactly(component.unregisterAction, action);
        });

        it("should do nothing when the action already exists", function() {
            const action = { id: "123-#actions-123" };
            const component = {
                actions: [action],
            };

            this.target.props.OnPickTrigger.setter(component, {
                action,
                toRemove: false,
            });
        });
    });

    describe("transformer", function() {
        setup();

        it("should create ExecuteCodeAction", function() {
            const { sandbox } = this;
            const action = { id: "123-#actions-123" };
            const BABYLON = {
                ExecuteCodeAction: sandbox.stub().returns(action),
                ActionManager: {
                    OnPickTrigger: "any-thing",
                },
            };

            const OnPickTrigger = sandbox.stub();
            const result = this.target.props.OnPickTrigger.transformer(
                { BABYLON },
                OnPickTrigger
            );

            const expectedResult = {
                action: {
                    id: action.id,
                    func: OnPickTrigger,
                },
                toRemove: false,
            };

            sinon.assert.calledOnce(BABYLON.ExecuteCodeAction);
            sinon.assert.calledWithExactly(
                BABYLON.ExecuteCodeAction,
                BABYLON.ActionManager.OnPickTrigger,
                OnPickTrigger
            );
            expect(result).to.deep.equals(expectedResult);
        });

        it("should return an existing Action", function() {
            const { sandbox } = this;
            const OnPickTrigger = sandbox.stub();
            const action = { id: "123-#actions-123", func: OnPickTrigger };
            const result = this.target.props.OnPickTrigger.transformer(
                {},
                OnPickTrigger,
                { action }
            );

            const expectedResult = {
                action,
                toRemove: false,
            };
            expect(result).to.deep.equals(expectedResult);
        });

        it("should mark Action to be removed", function() {
            const { sandbox } = this;
            const OnPickTrigger = sandbox.stub();
            const action = { id: "123-#actions-123", func: OnPickTrigger };
            const result = this.target.props.OnPickTrigger.transformer(
                {},
                null,
                { action }
            );

            const expectedResult = {
                action,
                toRemove: true,
            };
            expect(result).to.deep.equals(expectedResult);
        });
    });
});
