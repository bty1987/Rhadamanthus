/**
 * @File Name		: VillageCountAction.java
 * @Package   	: com.fanglin.report.action
 * @Version		: 1.0
 * @Date			: 2016-11-12
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.report.service.VillageCountService;
import com.fanglin.report.vo.VillageCountVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VillageCountAction extends BaseListAction {

	private static final long serialVersionUID = 4260074093535152847L;
	
	@Autowired
	private VillageCountService villageCountService;
	
	private List<VillageCountVO> villageCounts;
	
	private VillageVO village;
	
	private double range;
	
	@Action(value="reportVillageCount", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String reportVillageCount(){
		
		villageCounts = villageCountService.queryVillageCountByXY(village, range);
		
		return SUCCESS;
	}

	public List<VillageCountVO> getVillageCounts() {
		return villageCounts;
	}

	public void setVillageCounts(List<VillageCountVO> villageCounts) {
		this.villageCounts = villageCounts;
	}

	public VillageVO getVillage() {
		return village;
	}

	public void setVillage(VillageVO village) {
		this.village = village;
	}

	public double getRange() {
		return range;
	}

	public void setRange(double range) {
		this.range = range;
	}

}
