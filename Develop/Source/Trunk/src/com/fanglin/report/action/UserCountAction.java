/**
 * @File Name		: UserCountAction.java
 * @Package   	: com.fanglin.report.action
 * @Version		: 1.0
 * @Date			: 2016-11-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.action;

import java.text.ParseException;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.report.service.DUserCountDetailService;
import com.fanglin.report.vo.DUserCountDetailVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserCountAction extends BaseListAction {

	private static final long serialVersionUID = 7973943334045757706L;
	
	@Autowired
	private DUserCountDetailService dUserCountDetailService;
	
	private List<DUserCountDetailVO> dUserCountDetailVOs;
	
	@Action(value="queryDUserCountDetail", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryDUserCountDetail() throws FLException, ParseException{
		
		dUserCountDetailVOs = dUserCountDetailService.queryDUserCountDetail(getFilters(), queryUserId());
		
		return SUCCESS;
	}

	public List<DUserCountDetailVO> getdUserCountDetailVOs() {
		return dUserCountDetailVOs;
	}

	public void setdUserCountDetailVOs(List<DUserCountDetailVO> dUserCountDetailVOs) {
		this.dUserCountDetailVOs = dUserCountDetailVOs;
	}
	
}
