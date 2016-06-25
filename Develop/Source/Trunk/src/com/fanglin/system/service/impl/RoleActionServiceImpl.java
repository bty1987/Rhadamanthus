package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.system.dao.RoleActionDao;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.dao.RoleSubfunctionDao;
import com.fanglin.system.dao.SubFunctionActionDao;
import com.fanglin.system.po.RoleActionPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.po.RoleSubfunctionPO;
import com.fanglin.system.po.SubFunctionActionPO;
import com.fanglin.system.po.SubFunctionPO;
import com.fanglin.system.service.RoleActionService;
import com.fanglin.system.vo.FunctionVO;
import com.fanglin.system.vo.ModuleVO;
import com.fanglin.system.vo.RoleActionVO;
import com.fanglin.system.vo.RoleSubfunctionVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.system.vo.SubFunctionActionVO;
import com.fanglin.system.vo.SubFunctionVO;
import com.fanglin.system.vo.ZNodeVO;
import com.fanglin.utils.BeanUtil;

@Service("roleActionService")
@Transactional(readOnly = true)
public class RoleActionServiceImpl implements RoleActionService {

	@Autowired
	private RoleActionDao roleActionDao;

	@Autowired
	private SubFunctionActionDao subFunctionActionDao;
	
	@Autowired
	private RoleDao roleDao;
	
	@Autowired
	private RoleSubfunctionDao roleSubfunctionDao;
	
	@Override
	public List<RoleActionVO> queryRoleActionByRoleId(RoleVO roleVO){
		
		String roleId = roleVO.getRoleId();
		
		RolePO rolePO = roleDao.get(roleId);
		List<RoleActionPO> roleActionPOList = roleActionDao.queryRoleActionByRoleId(roleId);
		List<SubFunctionActionPO> actionList =  subFunctionActionDao.querySubFunctionAction();
		List<RoleActionVO> roleActionVOList = new ArrayList<RoleActionVO>();
		
		for(SubFunctionActionPO subFunctionActionPO: actionList){
			RoleActionVO roleActionVO = new RoleActionVO();
			
			RoleVO _roleVO = new RoleVO();
			BeanUtil.copyProperties(rolePO,_roleVO);
			roleActionVO.setRole(_roleVO);
			
			SubFunctionActionVO subFunctionActionVO = new SubFunctionActionVO();
			BeanUtil.copyProperties(subFunctionActionPO, subFunctionActionVO, Arrays.asList("subFunction"));
			
			SubFunctionVO subFunction = new SubFunctionVO();
			subFunction.setSubFunctionId(subFunctionActionPO.getSubFunction().getSubFunctionId());
			subFunction.setSubFunctionName(subFunctionActionPO.getSubFunction().getSubFunctionName());
			
			FunctionVO function = new FunctionVO();
			function.setFunctionId(subFunctionActionPO.getSubFunction().getFunction().getFunctionId());
			function.setFunctionName(subFunctionActionPO.getSubFunction().getFunction().getFunctionName());
			
			ModuleVO module = new ModuleVO();
			module.setModuleId(subFunctionActionPO.getSubFunction().getFunction().getModule().getModuleId());
			module.setModuleName(subFunctionActionPO.getSubFunction().getFunction().getModule().getModuleName());
			function.setModule(module);
			subFunction.setFunction(function);
			
			subFunctionActionVO.setSubFunction(subFunction);
			roleActionVO.setSubFunctionAction(subFunctionActionVO);
			
			boolean findFlag = false;
			for(RoleActionPO roleActionPO: roleActionPOList){
				if(roleActionPO.getSubFunctionAction().getActionId() == subFunctionActionPO.getActionId()){
					findFlag = true;
					break;
				}
			}
			
			if(RolePO.SUPER_ROLEID_STR.equals(_roleVO.getRoleId())){
				roleActionVO.setRight(1);
			}else{
				if(findFlag){
					roleActionVO.setRight(1);
				}else{
					if(subFunctionActionPO.getDefaultFlag() == 1){
						roleActionVO.setRight(1);
					}else{
						roleActionVO.setRight(0);
					}
				}
			}
			roleActionVOList.add(roleActionVO);
		}
		
		return roleActionVOList;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveRoleRight(List<ZNodeVO> rightTree, RoleVO role){
		
		if(RolePO.SUPER_ROLEID_STR.equals(role.getRoleId())){
			return 0;
		}
		
		List<RoleActionVO> roleActions = new ArrayList<RoleActionVO>();
		List<RoleSubfunctionVO> roleSubfunctions = new ArrayList<RoleSubfunctionVO>();
		
		for(ZNodeVO zNodeVO: rightTree){
			for(ZNodeVO func: zNodeVO.getChildren()){
				for(ZNodeVO subFunc: func.getChildren()){
					if("true".equals(subFunc.getChecked())){
						SubFunctionVO subFunction = new SubFunctionVO();
						subFunction.setSubFunctionId(subFunc.getId());
						
						RoleSubfunctionVO roleSubFunction = new RoleSubfunctionVO();
						roleSubFunction.setRole(role);
						roleSubFunction.setSubFunction(subFunction);
						
						roleSubfunctions.add(roleSubFunction);
					}
					
					for(ZNodeVO action: subFunc.getChildren()){
						
						SubFunctionActionVO subFunctionAction = new SubFunctionActionVO();
						subFunctionAction.setActionId(action.getId());
						
						RoleActionVO roleAction = new RoleActionVO();
						roleAction.setRole(role);
						roleAction.setSubFunctionAction(subFunctionAction);
						
						if("true".equals(action.getChecked())){
							roleAction.setRight(1);
						}else{
							roleAction.setRight(0);
						}
						
						roleActions.add(roleAction);
					}
				}
			}
		}
		
		saveRoleAction(roleActions);
		saveRoleSubfunction(roleSubfunctions, role.getRoleId());
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveRoleAction(List<RoleActionVO> roleActionVOs){
		for(RoleActionVO roleActionVO: roleActionVOs){
			if(roleActionVO.getRight() == 1){
				RoleActionPO roleActionPO = roleActionDao.queryRoleActionByActionIdARoleId(roleActionVO.getRole().getRoleId(), roleActionVO.getSubFunctionAction().getActionId());
				
				if(roleActionPO == null){
					roleActionPO = new RoleActionPO();
					
					RolePO role = new RolePO();
					role.setRoleId(roleActionVO.getRole().getRoleId());
					
					SubFunctionActionPO subFunctionAction = new SubFunctionActionPO();
					subFunctionAction.setActionId(roleActionVO.getSubFunctionAction().getActionId());
					
					roleActionPO.setRole(role);
					roleActionPO.setSubFunctionAction(subFunctionAction);
					
					roleActionDao.save(roleActionPO);
				}
			}else{
				RoleActionPO roleActionPO = roleActionDao.queryRoleActionByActionIdARoleId(roleActionVO.getRole().getRoleId(), roleActionVO.getSubFunctionAction().getActionId());
				
				if(roleActionPO != null ){
					
					roleActionDao.delete(roleActionPO);
				}
			}
		}
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveRoleSubfunction(List<RoleSubfunctionVO> roleSubfunctions, String roleId){
		
		List<RoleSubfunctionPO> roleSubfunctionPOs = roleSubfunctionDao.findRoleSubFunctionByRoleId(roleId);
		
		for(RoleSubfunctionVO roleSubfunctionVO: roleSubfunctions){
			boolean findFlag = false;
			for(RoleSubfunctionPO roleSubfunctionPO: roleSubfunctionPOs){
				if(roleSubfunctionPO.getRole().getRoleId().equals(roleSubfunctionVO.getRole().getRoleId()) && roleSubfunctionPO.getSubFunction().getSubFunctionId() == roleSubfunctionVO.getSubFunction().getSubFunctionId()){
					findFlag = true;
					break;
				}
			}
			
			if(findFlag == false){
				RoleSubfunctionPO roleSubfunctionPO = new RoleSubfunctionPO();
				
				RolePO role = new RolePO();
				role.setRoleId(roleSubfunctionVO.getRole().getRoleId());
				roleSubfunctionPO.setRole(role);
				
				SubFunctionPO subfunction = new SubFunctionPO();
				subfunction.setSubFunctionId(roleSubfunctionVO.getSubFunction().getSubFunctionId());
				roleSubfunctionPO.setSubFunction(subfunction);
				
				roleSubfunctionDao.save(roleSubfunctionPO);
			}
		}
		
		for(RoleSubfunctionPO roleSubfunctionPO: roleSubfunctionPOs){
			boolean findFlag = false;
		
			for(RoleSubfunctionVO roleSubfunctionVO: roleSubfunctions){
				if(roleSubfunctionPO.getRole().getRoleId().equals(roleSubfunctionVO.getRole().getRoleId()) && roleSubfunctionPO.getSubFunction().getSubFunctionId() == roleSubfunctionVO.getSubFunction().getSubFunctionId()){
					findFlag = true;
					break;
				}
			}
			
			if(findFlag == false){
				roleSubfunctionDao.delete(roleSubfunctionPO);
			}
		}
		
		return 0;
	}

	@Override
	public boolean checkRoleActionRight(String roleId, String actionName){
		
		if(RolePO.SUPER_ROLEID_STR.equals(roleId)){
			return true;
		}
		
		RoleActionPO roleAction = null;
		SubFunctionActionPO subFunctionActionPO = subFunctionActionDao.querySubFunctionActionByActionName(actionName);
		
		if(subFunctionActionPO != null){
			
			roleAction = roleActionDao.queryRoleActionByActionIdARoleId(roleId, subFunctionActionPO.getActionId());
			
			if(roleAction != null){
				return true;
			}else{
				return false;
			}
		}else{
			return true;
		}
	}
}
