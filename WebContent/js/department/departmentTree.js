
jQuery(function ($) {

	com.post(api.communion.queryDepartment, { }, function (res) {
		com.post(api.communion.queryDepartmentType, {}, function (ret) {
			var data = {
				children: [],
				name: "部门类型"
			};
			$.each(ret.departmentTypes, function (i, v) {
				var _data = {
					children: [],
					name: v.name,
					isCollapsed: true
				};
				$.each(res.deptList, function (index, value) {
					if (value.type.dtid == v.dtid) {
						_data.children.push({
							children: [],
							name: value.deptName
						})
					}
				})
				data.children.push(_data)
			})
/**/
			const Util = G6.Util;
			// 准备布局配置
			const layoutCfg = {
				"direction": "LR",
				"nodeSep": 10,
				"nodeSize": 10,
				"rankSep": 100
			};
			// 自定义树节点
			const DEFAULT_NODE_SIZE = 5;
			G6.registerNode('treeNode', {
				draw(cfg, group) {
					const model = cfg.model;
					const r = layoutCfg.nodeSize ? layoutCfg.nodeSize / 2 : DEFAULT_NODE_SIZE;
					const shapeCfg = {
						attrs: {
							x: cfg.x,
							y: cfg.y,
							r: r,
							stroke: '#003380',
							fill: 'white',
							fillOpacity: 1,
						},
					};
					if (model.children && model.children.length) {
						shapeCfg.class = model.isCollapsed ? 'spreadoutButton' : 'collapseButton';
						shapeCfg.attrs.fill = '#044A9A';
						shapeCfg.attrs.stroke = '#003380';
						shapeCfg.attrs.fillOpacity = 0.4;
					}
					if (model.root) {
						shapeCfg.attrs.fill = '#044A9A';
						shapeCfg.attrs.stroke = '#003380';
						shapeCfg.attrs.fillOpacity = 0.7;
					}
					shapeCfg.attrStash = Util.mix({}, shapeCfg.attrs);
					return group.addShape('circle', shapeCfg);
				},
				afterDraw(cfg, group) {
					const model = cfg.model;
					const r = layoutCfg.nodeSize ? layoutCfg.nodeSize / 2 : DEFAULT_NODE_SIZE;
					const align = model.align;
					const labelAttrs = {
						text: model.name,
						fill: '#666',
						textBaseline: 'middle',
						fontSize: 12,
						x: cfg.x + r + DEFAULT_NODE_SIZE,
						y: cfg.y,
						textAlign: 'left',
					};
					if (align === 'R') {
						Util.mix(labelAttrs, {
							x: cfg.x - r - DEFAULT_NODE_SIZE,
							y: cfg.y,
							textAlign: 'right',
						});
					} else if (align === 'T' || align === 'CH') {
						Util.mix(labelAttrs, {
							x: cfg.x,
							y: cfg.y + r + DEFAULT_NODE_SIZE,
							textAlign: 'right',
							rotate: -Math.PI / 2,
						});
					} else if (align === 'B') {
						Util.mix(labelAttrs, {
							x: cfg.x,
							y: cfg.y - r - DEFAULT_NODE_SIZE,
							textAlign: 'left',
							rotate: -Math.PI / 2,
						});
					}
					const label = group.addShape('text', {
						attrs: labelAttrs,
					});
					return label;
				}
			});

			// 生成树图实例
			const tree = new G6.Tree({
				id: 'mountNode',                            // 容器ID
				height: window.innerHeight,   // 画布高
                width:window.innerWidth,
				fitView: 'lc',                 // 自动缩放
				layoutFn: G6.Layouts.LayeredTidyTree, // 布局类型
				layoutCfg: layoutCfg,                // 布局配置
				showButton: false,
			});

			// 加载数据
			tree.source(data);
			tree.node().shape('treeNode');
			tree.edge()
				.shape('smooth')
				.style({
					stroke: '#A9BCD3'
				});
			// 渲染树图
			tree.render();
			/**/
		});
	});
})