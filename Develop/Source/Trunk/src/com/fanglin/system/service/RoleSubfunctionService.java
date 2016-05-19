package com.fanglin.system.service;

import java.util.List;

import com.fanglin.system.vo.RoleSubfunctionVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.system.vo.TreeVO;

public interface RoleSubfunctionService {

	public List<TreeVO> getTreeByRoleId(String roleId);

	List<RoleSubfunctionVO> getRoleSubfunctionsByRoleId(RoleVO roleVO);
}
