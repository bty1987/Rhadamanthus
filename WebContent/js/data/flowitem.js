jQuery(function($) {

    api = parent.api;
    config = parent.config;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;

    var container = document.getElementById("drawflow");

    var flower = new Drawflow(container);

    var s = {};
    var h = "";

    com.post(api.data.queryFlowitem, {
        "flowitem.fpid": parent.params.data.fpid
    }, function(e) {

        for ( var i = 0; i < e.flowitems.length; i++) {

            var outputs = {};
            var inputs = {};
            var outputArr = new Array();
            var inputArr = new Array();

            if (e.flowitems[i].name == "facebook") {
                h = " <div> <div class=\"title-box\"><i class=\"start\"></i> 开始节点</div> </div>"
            } else if (e.flowitems[i].name == "dbclick") {
                h = " <div> <div class=\"title-box\"><i class=\"fas fa-mouse\"></i> 单节点</div>  <div class=\"box dbclickbox\">单节点 <div class=\"modal\" style=\"display:none\"> <div class=\"modal-content\"> <span class=\"close\" >&times;</span> <input type=\"text\" df-name> </div> </div> </div> </div>"
            } else if (e.flowitems[i].name == "log") {
                h = "  <div><div class=\"title-box\"><i class=\"fas fa-file-signature\"></i> 结束节点 </div> </div>  "
            } else if (e.flowitems[i].name == "template") {
                h = " <div><div class=\"title-box\"><i class=\"text\"></i> 备注</div> <div class=\"box\"> 内容 <textarea df-template></textarea></div></div>"
            }

            if (e.flowitems[i].nfiid == 0) {

                for ( var j = 0; j < e.flowitems.length; j++) {
                    if (e.flowitems[j].pfiid == e.flowitems[i].type) {
                        outputArr.push({
                            node: e.flowitems[j].type,
                            output: "input_1"
                        });
                    }
                }
                outputs = {
                    output_1: {
                        connections: outputArr
                    }
                };
            } else {
                outputs = {
                    output_1: {
                        connections: new Array({
                            node: e.flowitems[i].nfiid,
                            output: "input_1"
                        })
                    }
                };
            }

            if (e.flowitems[i].pfiid == 0) {
                for ( var l = 0; l < e.flowitems.length; l++) {
                    if (e.flowitems[l].nfiid == e.flowitems[i].type) {
                        inputArr.push({
                            node: e.flowitems[l].type,
                            input: "output_1"
                        });
                    }
                }
                inputs = {
                    input_1: {
                        connections: inputArr
                    }
                };
            } else {
                inputs = {
                    input_1: {
                        connections: new Array({
                            node: e.flowitems[i].pfiid,
                            input: "output_1"
                        })
                    }
                };
            }

            if (e.flowitems[i].name == "facebook") {
                inputs = {}
            } else if (e.flowitems[i].name == "log") {
                outputs = {}
            }

            s[e.flowitems[i].type] = ({
                class: e.flowitems[i].name,
                data: {
                    template: e.flowitems[i].content
                },
                html: h,
                id: e.flowitems[i].type,
                name: e.flowitems[i].name,
                inputs: inputs,
                outputs: outputs,
                pos_x: e.flowitems[i].x,
                pos_y: e.flowitems[i].y,
                typenode: false
            });

        }

        var drawflow = {
            "drawflow": {
                "Home": {
                    "data": s
                }
            }
        };

        flower.reroute = true;
        flower.start();
        flower.import(drawflow);
    });

    function clear() {

        com.post(api.data.deleteFlowItem, {
            "flowitem.fpid": parent.params.data.fpid
        }, function(res) {

            flower.clearModuleSelected();
        });
    }

    function zoomout() {

        flower.zoom_out();
    }

    function reduction() {

        flower.zoom_reset();
    }

    function zoomin() {

        flower.zoom_in();
    }

    function exports() {

        var count = 0;
        var options = {
            "flowpath.fpid": parent.params.data.fpid
        };

        console.log(flower.export().drawflow.Home.data)

        for ( var i in flower.export().drawflow.Home.data) {

            var node = flower.export().drawflow.Home.data[i];

            options["flowitems[" + count + "].fpid"] = parent.params.data.fpid;
            options["flowitems[" + count + "].name"] = node.name;
            options["flowitems[" + count + "].type"] = node.id;
            options["flowitems[" + count + "].x"] = node.pos_x;
            options["flowitems[" + count + "].y"] = node.pos_y;
            options["flowitems[" + count + "].pfiid"] = 0;
            options["flowitems[" + count + "].nfiid"] = 0;
            options["flowitems[" + count + "].content"] = "";

            if (node.data != null) {
                options["flowitems[" + count + "].content"] = node.data.template;
            }

            if (node.inputs.input_1 != null && node.inputs.input_1.connections.length == 1) {
                options["flowitems[" + count + "].pfiid"] = node.inputs.input_1.connections[0].node;
            }

            if (node.outputs.output_1 != null && node.outputs.output_1.connections.length == 1) {
                options["flowitems[" + count + "].nfiid"] = node.outputs.output_1.connections[0].node;
            }

            count++;
        }

        com.post(api.data.addFlowitem, options);
    }

    var zoom = 1;
    var box = {};
    var elements = document.getElementsByClassName('drag-drawflow');

    for ( var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('touchend', drop, false);
        elements[i].addEventListener('touchmove', positionMobile, false);
        elements[i].addEventListener('touchstart', drag, false);
    }

    function positionMobile(ev) {

        mobile_last_move = ev;
    }

    function allowDrop(ev) {

        ev.preventDefault();
    }

    function drag(ev) {

        if (ev.type === "touchstart") {
            mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
        } else {
            ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
        }
    }

    function drop(ev) {

        if (ev.type === "touchend") {
            var parentdrawflow = document.elementFromPoint(mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow");
            if (parentdrawflow != null) {
                addNodeToDrawFlow(mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY);
            }
            mobile_item_selec = '';
        } else {
            ev.preventDefault();
            var data = ev.target.getAttribute('data-node');
            addNodeToDrawFlow(data, ev.clientX, ev.clientY);
        }
    }

    document.addEventListener("dragend", function(ev) {

        ev.preventDefault();
        drop(ev);
    });

    container.addEventListener("dropover", allowDrop);

    function addNodeToDrawFlow(name, pos_x, pos_y) {

        if (flower.flower_mode === 'fixed') {
            return false;
        }

        pos_x = pos_x * (flower.precanvas.clientWidth / (flower.precanvas.clientWidth * flower.zoom)) - (flower.precanvas.getBoundingClientRect().x * (flower.precanvas.clientWidth / (flower.precanvas.clientWidth * zoom)));
        pos_y = pos_y * (flower.precanvas.clientHeight / (flower.precanvas.clientHeight * flower.zoom)) - (flower.precanvas.getBoundingClientRect().y * (flower.precanvas.clientHeight / (flower.precanvas.clientHeight * zoom)));

        switch (name) {
            case 'facebook':
                var facebook = '<div><div class="title-box"><i class="start"></i> 开始节点</div></div>';
                flower.addNode('facebook', 0, 1, pos_x, pos_y, 'facebook', {}, facebook);
                break;

            case 'log':
                var log = '<div><div class="title-box"><i class="fas fa-file-signature"></i> 结束节点 </div></div>';
                flower.addNode('log', 1, 0, pos_x, pos_y, 'log', {}, log);
                break;
            case 'template':
                var template = '<div><div class="title-box"><i class="text"></i> 备注</div><div class="box">内容<textarea df-template></textarea></div></div>';
                flower.addNode('template', 1, 1, pos_x, pos_y, 'template', {
                    "template": ''
                }, template);
                break;

            case 'dbclick':
                var dbclick = '<div><div class="title-box"><i class="fas fa-mouse"></i> 单节点</div><div class="box dbclickbox" ">单节点<div class="modal" style="display:none"><div class="modal-content"><span class="close">&times;</span><input type="text" df-name></div></div></div></div>';
                flower.addNode('dbclick', 1, 1, pos_x, pos_y, 'dbclick', {
                    name: ''
                }, dbclick);
                break;

            default:
        }
    }

    $("#exporter").click(exports);
    $("#clearer").click(clear);
    $(".big").click(zoomin);
    $(".reduction").click(reduction);
    $(".small").click(zoomout);

});
