/*
 * @File Name	: UserAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: 用户管理相关action
 */

package com.fanglin.system.action;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.json.annotations.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.system.service.RoleActionService;
import com.fanglin.system.service.RoleSubfunctionService;
import com.fanglin.system.vo.RoleActionVO;
import com.fanglin.system.vo.RoleSubfunctionVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.system.vo.ZNodeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RoleActionAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;

	@Autowired
	private RoleActionService roleActionService;
	
	@Autowired
	private RoleSubfunctionService roleSubfunctionService;
	
	private RoleVO role;
	
	private RoleActionVO roleActionVO;

	private List<RoleVO> roleList;

	private List<ZNodeVO> zTree;
	
	private List<ZNodeVO> rightTree;
	
	@Action(value = "queryRoleRight", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String queryRoleRight(){
		
		List<RoleActionVO> roleActionList = roleActionService.queryRoleActionByRoleId(role);
		List<RoleSubfunctionVO> roleSubFunctionList = roleSubfunctionService.getRoleSubfunctionsByRoleId(role);
		
		zTree = new ArrayList<ZNodeVO>();
		boolean firstFlag = true;
		
		if(roleActionList != null && roleActionList.size() > 0){
			for(RoleActionVO roleActionVO: roleActionList){

				boolean moduleFlag = false;
				for(int i=0;i<zTree.size();++i){
					if(zTree.get(i).getId() == roleActionVO.getSubFunctionAction().getSubFunction().getFunction().getModule().getModuleId()){
						moduleFlag = true;
						
						boolean funFlag = false;
						List<ZNodeVO> functionList = zTree.get(i).getChildren();
						
						for(int j=0; j < functionList.size(); ++j){
							if(functionList.get(j).getId() == roleActionVO.getSubFunctionAction().getSubFunction().getFunction().getFunctionId()){
								funFlag = true;
								
								boolean subFunFlag = false;
								List<ZNodeVO> subFunctionList = zTree.get(i).getChildren().get(j).getChildren();
								for(int k=0;k<subFunctionList.size();++k){
									if(subFunctionList.get(k).getId() == roleActionVO.getSubFunctionAction().getSubFunction().getSubFunctionId()){
										
										subFunFlag = true;
										
										ZNodeVO zNodeVO = new ZNodeVO();
										zNodeVO.setId(roleActionVO.getSubFunctionAction().getActionId());
										zNodeVO.setName(roleActionVO.getSubFunctionAction().getActionDes());
										if(roleActionVO.getRight() == 0){
											zNodeVO.setChecked("false");
										}else{
											zNodeVO.setChecked("true");
										}
										zNodeVO.setOpen("false");
										zNodeVO.setChildren(new ArrayList<ZNodeVO>());
										zTree.get(i).getChildren().get(j).getChildren().get(k).getChildren().add(zNodeVO);
										
										break;
									}
								}
								
								if(!subFunFlag){
									ZNodeVO temSubFunc = new ZNodeVO();
									temSubFunc.setId(roleActionVO.getSubFunctionAction().getSubFunction().getSubFunctionId());
									temSubFunc.setName(roleActionVO.getSubFunctionAction().getSubFunction().getSubFunctionName());
									temSubFunc.setOpen("false");
									
									boolean findRightSubFunctionFlag = false;
									for(RoleSubfunctionVO itr : roleSubFunctionList){
										if(itr.getSubFunction().getSubFunctionId() == temSubFunc.getId()){
											findRightSubFunctionFlag = true;
											break;
										}
									}
									if(findRightSubFunctionFlag){
										temSubFunc.setChecked("true");
									}else{
										temSubFunc.setChecked("false");
									}
									
									temSubFunc.setChildren(new ArrayList<ZNodeVO>());
									
									ZNodeVO temAction = new ZNodeVO();
									temAction.setId(roleActionVO.getSubFunctionAction().getActionId());
									temAction.setName(roleActionVO.getSubFunctionAction().getActionDes());
									
									if(roleActionVO.getRight() == 0){
										temAction.setChecked("false");
									}else{
										temAction.setChecked("true");
									}
									
									temAction.setOpen("false");
									temAction.setChildren(new ArrayList<ZNodeVO>());
									
									temSubFunc.getChildren().add(temAction);
									
									zTree.get(i).getChildren().get(j).getChildren().add(temSubFunc);	
								}
								
								break;
							}
						}
						
						if(!funFlag){
							ZNodeVO zNodeVO = new ZNodeVO();
							zNodeVO.setId(roleActionVO.getSubFunctionAction().getSubFunction().getFunction().getFunctionId());
							zNodeVO.setName(roleActionVO.getSubFunctionAction().getSubFunction().getFunction().getFunctionName());
							zNodeVO.setChecked("false");
							zNodeVO.setOpen("true");
							zNodeVO.setNocheck("true");
							zNodeVO.setChildren(new ArrayList<ZNodeVO>());
							
							ZNodeVO temSubFunc = new ZNodeVO();
							temSubFunc.setId(roleActionVO.getSubFunctionAction().getSubFunction().getSubFunctionId());
							temSubFunc.setName(roleActionVO.getSubFunctionAction().getSubFunction().getSubFunctionName());
							temSubFunc.setChecked("false");
							temSubFunc.setOpen("false");
							temSubFunc.setChildren(new ArrayList<ZNodeVO>());
							
							boolean findRightSubFunctionFlag = false;
							for(RoleSubfunctionVO itr : roleSubFunctionList){
								if(itr.getSubFunction().getSubFunctionId() == temSubFunc.getId()){
									findRightSubFunctionFlag = true;
									break;
								}
							}
							if(findRightSubFunctionFlag){
								temSubFunc.setChecked("true");
							}else{
								temSubFunc.setChecked("false");
							}
							
							ZNodeVO temAction = new ZNodeVO();
							temAction.setId(roleActionVO.getSubFunctionAction().getActionId());
							temAction.setName(roleActionVO.getSubFunctionAction().getActionDes());
							if(roleActionVO.getRight() == 0){
								temAction.setChecked("false");
							}else{
								temAction.setChecked("true");
							}
							temAction.setOpen("false");
							temAction.setChildren(new ArrayList<ZNodeVO>());
							
							temSubFunc.getChildren().add(temAction);
							
							zNodeVO.getChildren().add(temSubFunc);
							
							zTree.get(i).getChildren().add(zNodeVO);	
						}
						
						break;
					}
				}
				
				if(!moduleFlag){
					ZNodeVO temModule = new ZNodeVO();
					temModule.setId(roleActionVO.getSubFunctionAction().getSubFunction().getFunction().getModule().getModuleId());
					temModule.setName(roleActionVO.getSubFunctionAction().getSubFunction().getFunction().getModule().getModuleName());
					temModule.setChecked("false");
					temModule.setOpen("true");
					temModule.setNocheck("true");
					temModule.setChildren(new ArrayList<ZNodeVO>());
					
					ZNodeVO temFunc = new ZNodeVO();
					temFunc.setId(roleActionVO.getSubFunctionAction().getSubFunction().getFunction().getFunctionId());
					temFunc.setName(roleActionVO.getSubFunctionAction().getSubFunction().getFunction().getFunctionName());
					temFunc.setChecked("false");
					temFunc.setOpen("true");
					temFunc.setNocheck("true");
					temFunc.setChildren(new ArrayList<ZNodeVO>());
					
					ZNodeVO temSubFunc = new ZNodeVO();
					temSubFunc.setId(roleActionVO.getSubFunctionAction().getSubFunction().getSubFunctionId());
					temSubFunc.setName(roleActionVO.getSubFunctionAction().getSubFunction().getSubFunctionName());
					temSubFunc.setChecked("false");
					if(firstFlag){
						temSubFunc.setOpen("true");
						firstFlag = false;
					}else{
						temSubFunc.setOpen("false");
					}
					boolean findRightSubFunctionFlag = false;
					for(RoleSubfunctionVO itr : roleSubFunctionList){
						if(itr.getSubFunction().getSubFunctionId() == temSubFunc.getId()){
							findRightSubFunctionFlag = true;
							break;
						}
					}
					if(findRightSubFunctionFlag){
						temSubFunc.setChecked("true");
					}else{
						temSubFunc.setChecked("false");
					}
					temSubFunc.setChildren(new ArrayList<ZNodeVO>());
					
					ZNodeVO temAction = new ZNodeVO();
					temAction.setId(roleActionVO.getSubFunctionAction().getActionId());
					temAction.setName(roleActionVO.getSubFunctionAction().getActionDes());
					
					if(roleActionVO.getRight() == 0){
						temAction.setChecked("false");
					}else{
						temAction.setChecked("true");
					}
					
					if(firstFlag){
						temAction.setOpen("true");
						firstFlag = false;
					}else{
						temAction.setOpen("false");
					}
					
					temAction.setChildren(new ArrayList<ZNodeVO>());
					
					temSubFunc.getChildren().add(temAction);
					
					temFunc.getChildren().add(temSubFunc);
					temModule.getChildren().add(temFunc);
					zTree.add(temModule);
				}
			}
		}
		
		return SUCCESS;
	}
	
	@Action(value = "updateRoleRight",  results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String updateRoleRight() throws UnsupportedEncodingException {

		roleActionService.saveRoleRight(rightTree, role);
		
		return SUCCESS;
	}

	public RoleVO getRole(){
		return role;
	}

	public void setRole(RoleVO role){
		this.role = role;
	}

	public List<RoleVO> getRoleList(){
		return roleList;
	}

	public void setRoleList(List<RoleVO> roleList){
		this.roleList = roleList;
	}

	public List<ZNodeVO> getzTree(){
		return zTree;
	}

	public void setzTree(List<ZNodeVO> zTree){
		this.zTree = zTree;
	}

	@JSON(serialize = false)
	public List<ZNodeVO> getRightTree(){
		return rightTree;
	}

	public void setRightTree(List<ZNodeVO> rightTree){
		this.rightTree = rightTree;
	}

	public RoleActionVO getRoleActionVO() {
		return roleActionVO;
	}

	public void setRoleActionVO(RoleActionVO roleActionVO) {
		this.roleActionVO = roleActionVO;
	}

}
