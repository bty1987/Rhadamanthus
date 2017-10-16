package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.ChainPageVO;
import com.fanglin.data.po.ChainPagePO;
import com.fanglin.right.dao.RoleChainPageDao;
import com.fanglin.right.po.RoleChainPagePO;
import com.fanglin.right.service.RoleChainPageService;
import com.fanglin.right.vo.RoleChainPageVO;
import com.fanglin.utils.BeanUtil;

@Service("roleChainPageService")
@Transactional(readOnly = true)
public class RoleChainPageServiceImpl  implements RoleChainPageService{

	@Autowired
	private RoleChainPageDao roleChainPageDao;
	
	@Override
	public List<ChainPageVO> queryRoleChainPageByRid(RoleChainPageVO roleChainPageVO) {
		
		List<RoleChainPagePO> roleChainPagePOs =roleChainPageDao.queryRoleChainPageByRid(roleChainPageVO.getRid());
		List<ChainPageVO> chainPageVOs = new ArrayList<ChainPageVO>();
		for (RoleChainPagePO roleChainPagePO : roleChainPagePOs) {
			ChainPageVO chainPageVO = new ChainPageVO();
			
			BeanUtil.copyProperties(roleChainPagePO.getChainPage(),chainPageVO);
			
			chainPageVOs.add(chainPageVO);
		}
		
		return chainPageVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateRoleChainPage(RoleChainPageVO roleChainPageVO,List<Long> wfids) throws FLException {
		
		int rid = roleChainPageVO.getRid();

		roleChainPageDao.deleteRoleChainPage(rid);
		
		if(wfids !=null){
			for(long wfid: wfids) {
				roleChainPageDao.save(new RoleChainPagePO(rid,new ChainPagePO(wfid)));
			}
		}	
		return 0;
	}

}
