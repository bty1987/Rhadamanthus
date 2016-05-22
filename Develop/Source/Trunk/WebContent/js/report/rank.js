var rank = {
	item: {},
};

jQuery(function($) {
	
	$("[name='rankType']").change(function(e){
		$("[name='rankType']").each(function(i, e){
			$(e).prop('checked', 0);
		});
		
		$(this).prop('checked', 1);
		
		queryRankInfo();
	});
	
	$("[name='rankRegion']").change(function(e){
		$("[name='rankRegion']").each(function(i, e){
			$(e).prop('checked', 0);
		});
		
		$(this).prop('checked', 1);
		
		queryRankInfo();
	});
	
});

function queryRankInfo(){
	
	var type = "";
	var region = "";
	var name = "";
	
	$("[name='rankType']").each(function(i, e){
		var checkBox = $(e);
		
		if(checkBox.prop('checked')){
			type = checkBox.attr("id");
		}
	});
	
	$("[name='rankRegion']").each(function(i, e){
		var checkBox = $(e);
		
		if(checkBox.prop('checked')){
			region = checkBox.attr("id");
			name = "designer" + checkBox.attr("ename") + "Name";
		}
	});
	
	var url = api.report["query" + type + region + "Rank"];
	
	if(url != undefined){
		com.post(url, {}, function(res){
			var ranks = res.ranks;
			
			var length = ranks.length;
			var offset = length % 3;
			var lineNum = parseInt(length / 3) + (offset > 0 ? 1 : 0);
			
			var rankInfo = $("#rankInfo").html("");
			
			if(length > 50){
				insertTable("col-xs-4", 1, ranks.slice(0, lineNum), name);
				insertTable("col-xs-4", lineNum + 1, ranks.slice(lineNum, lineNum * 2), name);
				insertTable("col-xs-4", 2 * lineNum + 1, ranks.slice(lineNum * 2), name);
			}else{
				insertTable("col-md-offset-3 col-xs-4", 1, ranks, name);
			}
		})
	}
}

function insertTable(colxs, index, rankData, name){
	
	var rankInfo = $("#rankInfo");
	
	var div = $("<div></div>").addClass(colxs).appendTo(rankInfo);
	
	var table = $("<table></table>").addClass("table table-striped table-bordered table-hover").appendTo(div)
	var tbody = $("<tbody></tbody>").appendTo(table);
	
	for(var i=0;i<rankData.length;i++){
		
		var _ = rankData[i];
		
		var _tr = $("<tr></tr>").appendTo(tbody);
		var _tdO = $("<td></td>").text(index + i).appendTo(_tr);
		var _tdT = $("<td></td>").text(_[name]).appendTo(_tr);
	}
}