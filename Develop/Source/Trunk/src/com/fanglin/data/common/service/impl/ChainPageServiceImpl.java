package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;       
import sun.misc.BASE64Encoder;   
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.ChainPageDao;
import com.fanglin.data.common.service.ChainPageService;
import com.fanglin.data.common.vo.ChainPageVO;
import com.fanglin.data.po.ChainPagePO;
import com.fanglin.right.dao.RoleChainPageDao;
import com.fanglin.right.po.RoleChainPagePO;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.po.RolePO;
import com.fanglin.utils.BeanUtil;

@Service("chainPageService")
@Transactional(readOnly=true)
public class ChainPageServiceImpl implements ChainPageService{
	
	@Autowired
	private ChainPageDao chainPageDao;
	
	@Autowired
	private RoleChainPageDao roleChainPageDao;
	
	@Autowired
	private RoleDao roleDao;
	
	@Override
	public List<ChainPageVO> queryChainPage() throws FLException {
		List<ChainPagePO> chainPagePOs = chainPageDao.list();
		List<ChainPageVO> chainPageVOs = new ArrayList<ChainPageVO>();
		for (ChainPagePO chainPagePO : chainPagePOs) {
			ChainPageVO chainPageVO = new ChainPageVO();
			BeanUtil.copyProperties(chainPagePO,chainPageVO);
			
			chainPageVOs.add(chainPageVO);
		}
		
		return chainPageVOs;
	}

	@Override
	public List<ChainPageVO> queryChainPageForSelf(String roleId,int company) throws FLException {
		
		BASE64Encoder encoder = new BASE64Encoder();  
		String encode = encoder.encode(String.valueOf(company).getBytes());
		String url= "&company="+encode+"&op=view";
		
		RolePO rolePO = roleDao.get(roleId);
	
		List<RoleChainPagePO> roleChainPagePOs =roleChainPageDao.queryRoleChainPageByRid(rolePO.getrId());
		List<ChainPageVO> chainPageVOs = new ArrayList<ChainPageVO>();

		for (RoleChainPagePO roleChainPagePO : roleChainPagePOs) {
			ChainPageVO chainPageVO = new ChainPageVO();
			BeanUtil.copyProperties(roleChainPagePO.getChainPage(),chainPageVO);
			chainPageVO.setUrl(roleChainPagePO.getChainPage().getUrl()+url);
			chainPageVOs.add(chainPageVO);
		}
		
		return chainPageVOs;
	
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addChainPage(ChainPageVO chainPageVO) throws FLException {
		
		ChainPagePO chainPagePO = new ChainPagePO();
		BeanUtil.copyProperties(chainPageVO,chainPagePO);
		chainPageDao.save(chainPagePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteChainPage(ChainPageVO chainPageVO) throws FLException {
		
		ChainPagePO chainPagePO = chainPageDao.get(chainPageVO.getCpid());
		
		List<RoleChainPagePO> RoleChainPagePOs = roleChainPageDao.queryRoleChainPageByCpid(chainPageVO.getCpid());
		for (RoleChainPagePO roleChainPagePO : RoleChainPagePOs) {
			if (roleChainPagePO.getChainPage()!=null) {
				throw new FLException(130013, "外链已使用");
			}
		}

		chainPageDao.delete(chainPagePO);
	}

	
}
