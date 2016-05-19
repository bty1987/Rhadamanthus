package com.fanglin.system.service;

import java.util.List;

import com.fanglin.system.vo.RoleActionVO;
import com.fanglin.system.vo.RoleSubfunctionVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.system.vo.ZNodeVO;

public interface RoleActionService {
	
	public List<RoleActionVO> queryRoleActionByRoleId(RoleVO roleVO);
	
	public int saveRoleRight(List<ZNodeVO> rightTree, RoleVO roleVO);

	public int saveRoleAction(List<RoleActionVO> roleActions);
	
	public int saveRoleSubfunction(List<RoleSubfunctionVO> roleSubfunctions, String roleId);

	public boolean checkRoleActionRight(String roleId, String actionName);
	
}
