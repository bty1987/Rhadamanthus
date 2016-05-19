/**
 * @File Name		: ActivityAction.java
 * @Package   	: com.fanglin.information.action
 * @Version		: 1.0
 * @Date			: 2015-11-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.ActivityItemService;
import com.fanglin.information.service.ActivityService;
import com.fanglin.information.vo.ActivityItemVO;
import com.fanglin.information.vo.ActivityVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ActivityAction extends BaseListAction {

	private static final long serialVersionUID = 5861898517086836202L;
	
	@Autowired
	private ActivityService activityService;
	
	@Autowired
	private ActivityItemService activityItemService;
	
	private ActivityVO activity;
	
	private ActivityItemVO activityItem;
	
	private List<ActivityVO> activitys;
	
	private List<ActivityItemVO> activityItems;
	
	@Action(value="pageActivity", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageActivity() throws FLException{
		
		activityService.pageActivity(getPaging(), getFilters(), getUserId());
		
		return SUCCESS;
	}
	
	@Action(value="queryActivityForValid", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryActivityForValid(){
		
		activitys = activityService.queryActivityForValid();
		
		return SUCCESS;
	}
	
	@Action(value="queryActivityItemByAId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryActivityItemByAId(){
		
		activityItems = activityItemService.queryActivityItemByAId(activity);
		
		return SUCCESS;
	}
	
	@Action(value="addActivity", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addActivity() throws FLException{
		
		activityService.addActivity(activity, getUserId(), getUserName());
		
		return SUCCESS;
	}
	
	@Action(value="addActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addActivityItem() throws FLException{
		
		activityItemService.addActivityItem(activity, activityItem);
		
		return SUCCESS;
	}
	
	@Action(value="updateActivity", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateActivity() throws FLException{
		
		activityService.updateActivity(activity, getUserId());
		
		return SUCCESS;
	}
	
	@Action(value="updateActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateActivityItem() throws FLException{
		
		activityItemService.updateActivityItem(activity, activityItem);
		
		return SUCCESS;
	}
	
	@Action(value="deleteActivityItemByAiId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteActivityItemByAiId(){
		
		activityItemService.deleteActivityItemByAiId(activity, activityItem);
		
		return SUCCESS;
	}

	public ActivityVO getActivity() {
		return activity;
	}

	public void setActivity(ActivityVO activity) {
		this.activity = activity;
	}

	public ActivityItemVO getActivityItem() {
		return activityItem;
	}

	public void setActivityItem(ActivityItemVO activityItem) {
		this.activityItem = activityItem;
	}

	public List<ActivityItemVO> getActivityItems() {
		return activityItems;
	}

	public void setActivityItems(List<ActivityItemVO> activityItems) {
		this.activityItems = activityItems;
	}

	public List<ActivityVO> getActivitys() {
		return activitys;
	}

	public void setActivitys(List<ActivityVO> activitys) {
		this.activitys = activitys;
	}

}
