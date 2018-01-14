/**
 * @File Name		: PeriodAction.java
 * @Package   	: com.fanglin.finance.action
 * @Version		: 1.0
 * @Date			: 2016-4-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.finance.service.PeriodService;
import com.fanglin.finance.vo.PeriodVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PeriodAction extends BaseListAction{

	private static final long serialVersionUID = -7937404471004315969L;
	
	@Autowired
	private PeriodService periodService;
	
	private List<PeriodVO> periods;
	
	private PeriodVO period;
	
	@Action(value = "queryPeriod", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String queryPeriod(){
		
		periods = periodService.queryPeriod();
		
		return SUCCESS;
	}
	
	@Action(value = "queryPeriodForCurrent", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String queryPeriodForCurrent(){
		
		period = periodService.queryPeriodForCurrent();
		
		return SUCCESS;
	}
	
	@Action(value = "queryPeriodForOpen", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String queryPeriodForOpen(){
		
		periods = periodService.queryPeriodForOpen();
		
		return SUCCESS;
	}

	public List<PeriodVO> getPeriods() {
		return periods;
	}

	public void setPeriods(List<PeriodVO> periods) {
		this.periods = periods;
	}

	public PeriodVO getPeriod() {
		return period;
	}

	public void setPeriod(PeriodVO period) {
		this.period = period;
	}

}
