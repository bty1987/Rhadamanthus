package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.Paging;

public interface RoleService {

	public void pageRole(Paging paging, List<Filter> filters, Integer company);

	public List<RoleVO> queryRole(Integer company);

	public RoleVO queryRoleByRid(RoleVO roleVO);

	public List<RoleVO> queryRoleByName(RoleVO roleVO, Integer company);

	public int addRole(RoleVO roleVO, Integer company, String userId) throws FLException;

	public int updateRole(RoleVO roleVO) throws FLException;

	public int deleteRoleByRid(RoleVO roleVO, int qid) throws FLException;

}
