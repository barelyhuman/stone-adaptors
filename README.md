# StoneCSS Adaptors

This is a monorepo containing the core adaptors of [StoneCSS](github.com/barelyhuman/stone), which can be used to understand how the engine works and what you can do with the engine.

The current adaptors are the following

- [x] Web Inject - Inject css to your html head and return a class for the same (SSR Not supported as of now)
- [x] Web Inline - Returns the actual DOM style object for you, to be used with ssr services where the inline styling will not effect performance on the final rendered page
- [x] React Native - Adaptor to add ability to use existing css in react native
- [ ] Web IO - This was an experimental adaptor for generating css files over a parser, but is better off as a babel plugin so this will not be migrated to this and will be removed from further versions from the core `@barelyhuman/stone` package as well.

If you want to have near zero runtime effect while still wanting to use StoneCSS you are better off with the babel plugin which has similar functionality to the web inject but instead will create css files for you while compiling.

## Documentation

The documentation for all the adaptors can be found on the core repo or [StoneCSS website](https://stone.reaper.im)

## Pitfalls / Caveats

### Web Inject

- A significant runtime perf drop if you have a lot of css in the current page, which itself is questionable but not the point, don't recommend using it for a super complex page.

<details>
  <summary markdown="span">Why even make this adaptor?</summary>

Considering stone itself is one big experiment, this was one of the first adaptors and pretty easy to write a prototype for. Thus, this exists and the performance downfall isn't much when used with frameworks that handle re-renders properly.

It is a performance issue when using with vanilla css where the updates and renders are not as atomic in the general developer space, if you have a good vanilla js setup that renders only the needed components, you shouldn't have a problem with this.

</details>

### Web Inline

- Same as above, but instead this is a little more performant when working with frameworks that do SSR, since the inline style is already hydrated for you. The same can be achieved to a point with the babel plugin that's a part of the core package `@barelyhuman/stone` itself.

### React Native

- The current caveats would be that , while the plugin sanitizes the given css to work perfectly with the react-native `Stylesheet.create` , it is limited to the use cases I've personally worked with, so will require the community to help out with feedback, issues, and if possible PR's

### License

[MIT](/LICENSE)
