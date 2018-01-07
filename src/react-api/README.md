# Architecture

## host context
Host context or child context should identify the scene and engine


## createInstance
1. create an id
2. merge props with the default values
3. create the wrapper with the id and the properties
if the component needs it parent to get created, it maybe a property rather than an element
4. the wrapper should create a `babylonjs creator`
5. return the wrapper reference 

## appendInitialChild
1. add the