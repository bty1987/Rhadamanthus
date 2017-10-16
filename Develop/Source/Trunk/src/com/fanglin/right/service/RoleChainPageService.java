package com.fanglin.right.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.ChainPageVO;
import com.fanglin.right.vo.RoleChainPageVO;

public interface RoleChainPageService {

	public List<ChainPageVO> queryRoleChainPageByRid(RoleChainPageVO roChainPageVO);
	
	public int updateRoleChainPage(RoleChainPageVO roleChainPageVO,List<Long> wfids) throws FLException;
	
}
