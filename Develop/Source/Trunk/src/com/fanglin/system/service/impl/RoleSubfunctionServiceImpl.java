package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.system.dao.RoleSubfunctionDao;
import com.fanglin.system.dao.SubFunctionDao;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.po.RoleSubfunctionPO;
import com.fanglin.system.po.SubFunctionPO;
import com.fanglin.system.service.RoleSubfunctionService;
import com.fanglin.system.vo.RoleSubfunctionVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.system.vo.SubFunctionVO;
import com.fanglin.system.vo.TreeVO;

@Service("roleSubfunctionService")
@Transactional(readOnly = true)
public class RoleSubfunctionServiceImpl implements RoleSubfunctionService {

	protected Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private RoleSubfunctionDao roleSubfunctionDao;
	
	@Autowired
	private SubFunctionDao subFunctionDao;
	
	@Override
	public List<RoleSubfunctionVO> getRoleSubfunctionsByRoleId(RoleVO roleVO){
		
		List<RoleSubfunctionPO> roleSubfunctionList = roleSubfunctionDao.findRoleSubFunctionByRoleId(roleVO.getRoleId());
		List<RoleSubfunctionVO> res = new ArrayList<RoleSubfunctionVO>();
		
		for(RoleSubfunctionPO roleSubfunctionPO : roleSubfunctionList){

			RoleSubfunctionVO roleSubfunctionVO = new RoleSubfunctionVO();
			SubFunctionVO subFunction = new SubFunctionVO();
			
			subFunction.setSubFunctionId(roleSubfunctionPO.getSubFunction().getSubFunctionId());
			subFunction.setSubFunctionName(roleSubfunctionPO.getSubFunction().getSubFunctionName());
			
			roleSubfunctionVO.setSubFunction(subFunction);
			roleSubfunctionVO.setRole(roleVO);
			
			res.add(roleSubfunctionVO);
		}
		
		return res;
	}
	
	@Override
	public List<TreeVO> getTreeByRoleId(String roleId){
		List<RoleSubfunctionPO> roleSubfunctionPOs = new ArrayList<RoleSubfunctionPO>();
		if(RolePO.SUPER_ROLEID_STR.equals(roleId)){
			RolePO role = new RolePO(RolePO.SUPER_ROLEID_STR);
			
			List<SubFunctionPO> subFunctionPOs = subFunctionDao.querySubFunction();
			for(SubFunctionPO subFunctionPO: subFunctionPOs){
				RoleSubfunctionPO roleSubfunctionPO = new RoleSubfunctionPO();
				roleSubfunctionPO.setRole(role);
				roleSubfunctionPO.setSubFunction(subFunctionPO);
				
				roleSubfunctionPOs.add(roleSubfunctionPO);
			}
		}else{
			roleSubfunctionPOs = roleSubfunctionDao.findRoleSubFunctionByRoleId(roleId);
		}
		
		List<TreeVO> tree =new  ArrayList<TreeVO>();

		if(roleSubfunctionPOs != null && roleSubfunctionPOs.size() > 0){
			for(RoleSubfunctionPO rp : roleSubfunctionPOs){

				boolean moduleFlag = false;
				int i=0;
				for(; i< tree.size(); ++i){
					if(tree.get(i).getId() == rp.getSubFunction().getFunction().getModule().getModuleId()){
						moduleFlag = true;
						
						boolean funFlag = false;
						List<TreeVO> functionList = tree.get(i).getSub();
						int j=0;
						for(; j < functionList.size(); ++j){
							if(functionList.get(j).getId() == rp.getSubFunction().getFunction().getFunctionId()){
								funFlag = true;
								
								TreeVO treeVO = new TreeVO();
								treeVO.setIcon(rp.getSubFunction().getSubfunctionIcon());
								treeVO.setId(rp.getSubFunction().getSubFunctionId());
								treeVO.setName(rp.getSubFunction().getSubFunctionName());
								treeVO.setUrl(rp.getSubFunction().getUrl());
								treeVO.setSub(new ArrayList<TreeVO>());
								tree.get(i).getSub().get(j).getSub().add(treeVO);
								
								break;
							}
						}
						
						if(!funFlag){
							TreeVO temFunc = new TreeVO();
							temFunc.setIcon(rp.getSubFunction().getFunction().getFunctionIcon());
							temFunc.setId(rp.getSubFunction().getFunction().getFunctionId());
							temFunc.setName(rp.getSubFunction().getFunction().getFunctionName());
							temFunc.setUrl("#");
							temFunc.setSub(new ArrayList<TreeVO>());
							
							TreeVO tem = new TreeVO();
							tem.setIcon(rp.getSubFunction().getSubfunctionIcon());
							tem.setId(rp.getSubFunction().getSubFunctionId());
							tem.setName(rp.getSubFunction().getSubFunctionName());
							tem.setUrl(rp.getSubFunction().getUrl());
							tem.setSub(new ArrayList<TreeVO>());
							
							temFunc.getSub().add(tem);
							
							tree.get(i).getSub().add(temFunc);	
						}
						
						break;
					}
				}
				
				if(!moduleFlag){
					TreeVO temModule = new TreeVO();
					temModule.setIcon(rp.getSubFunction().getFunction().getModule().getModuleIcon());
					temModule.setId(rp.getSubFunction().getFunction().getModule().getModuleId());
					temModule.setName(rp.getSubFunction().getFunction().getModule().getModuleName());
					temModule.setUrl("#");
					temModule.setSub(new ArrayList<TreeVO>());
					
					TreeVO temFunc = new TreeVO();
					temFunc.setIcon(rp.getSubFunction().getFunction().getFunctionIcon());
					temFunc.setId(rp.getSubFunction().getFunction().getFunctionId());
					temFunc.setName(rp.getSubFunction().getFunction().getFunctionName());
					temFunc.setUrl("#");
					temFunc.setSub(new ArrayList<TreeVO>());
					
					TreeVO tem = new TreeVO();
					tem.setIcon(rp.getSubFunction().getSubfunctionIcon());
					tem.setId(rp.getSubFunction().getSubFunctionId());
					tem.setName(rp.getSubFunction().getSubFunctionName());
					tem.setUrl(rp.getSubFunction().getUrl());
					tem.setSub(new ArrayList<TreeVO>());
					
					temFunc.getSub().add(tem);
					temModule.getSub().add(temFunc);
					tree.add(temModule);
				}
			}
		}
		return tree;
	}
	
}
