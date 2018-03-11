package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.ConstructionNodeDao;
import com.fanglin.communion.po.ConstructionNodeCompanyPO;
import com.fanglin.communion.po.ConstructionNodePO;
import com.fanglin.communion.service.ConstructionNodeService;
import com.fanglin.communion.vo.ConstructionNodeCompanyVO;
import com.fanglin.communion.vo.ConstructionNodeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("constructionNodeService")
@Transactional(readOnly=true)
public class ConstructionNodeServiceImpl implements ConstructionNodeService{

	@Autowired
	private ConstructionNodeDao constructionNodeDao;
	
	@Override
	public void pageConstructionNode(Paging paging, List<Filter> filters) {
		
		List<ConstructionNodePO> constructionNodePOs =  constructionNodeDao.pageConstructionNode(paging, filters);
		List<ConstructionNodeVO> constructionNodeVOs = new ArrayList<ConstructionNodeVO>();
		
		if(constructionNodePOs != null){
			for (ConstructionNodePO constructionNodePO : constructionNodePOs) {
				ConstructionNodeVO constructionNodeVO = new ConstructionNodeVO();
				BeanUtil.copyProperties(constructionNodePO, constructionNodeVO);
				constructionNodeVOs.add(constructionNodeVO);
			}
		}
		
		paging.setData(constructionNodeVOs);

	}

	@Override
	public List<ConstructionNodeVO> queryConstructionNode(ConstructionNodeVO constructionNode) {
		
		List<ConstructionNodePO> constructionNodePOs;
		
		if(constructionNode == null){
			constructionNodePOs = constructionNodeDao.queryConstructionNode(null);
		}else{
			constructionNodePOs = constructionNodeDao.queryConstructionNode(constructionNode.getStatus());
		}
		
		List<ConstructionNodeVO> constructionNodeVOs = new ArrayList<ConstructionNodeVO>();
		
		for (ConstructionNodePO constructionNodePO : constructionNodePOs) {
			ConstructionNodeVO constructionNodeVO  = new ConstructionNodeVO();
			BeanUtil.copyProperties(constructionNodePO, constructionNodeVO);
			constructionNodeVOs.add(constructionNodeVO);
		}
		
		return constructionNodeVOs;
	}
	
	@Override
	public List<ConstructionNodeVO> queryConstructionNodeByCid(ConstructionNodeCompanyVO constructionNodeCompanyVO) throws FLException{

		try{
			
			int cid = FormatUtil.decodeCompany(AESHelper.decryptString(constructionNodeCompanyVO.getCid(), SystemConfig.getString("encryptKey")));
			
			List<ConstructionNodeCompanyPO> constructionNodeCompanyPOs  = constructionNodeDao.queryConstructionNodeCompanyByCid(cid);
			List<ConstructionNodeVO> constructionNodeVOs = new ArrayList<ConstructionNodeVO>();
			
			for (ConstructionNodeCompanyPO constructionNodeCompanyPO : constructionNodeCompanyPOs) {
				ConstructionNodePO constructionNodePO= constructionNodeCompanyPO.getConstructionNode();
				ConstructionNodeVO constructionNodeVO  = new ConstructionNodeVO();
				BeanUtil.copyProperties(constructionNodePO, constructionNodeVO);
				constructionNodeVOs.add(constructionNodeVO);
			}
			
			return constructionNodeVOs;
		}catch (Exception e) {
			throw new FLException(230015 , "公司不存在");
		}
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addConstructionNode(ConstructionNodeVO constructionNodeVO) {

	  ConstructionNodePO constructionNodePO = new ConstructionNodePO();

	  constructionNodePO.setName(constructionNodeVO.getName());

	  constructionNodeDao.save(constructionNodePO);

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateConstructionNodeForStatus(ConstructionNodeVO constructionNodeVO) {

	  ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionNodeVO.getCnid());

	  constructionNodePO.setStatus(constructionNodeVO.getStatus());

	  constructionNodeDao.update(constructionNodePO);

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateConstructionNodeCompany(ConstructionNodeCompanyVO constructionNodeCompanyVO,List<Long> cnids) throws FLException {

	  try {
	    int cid = FormatUtil.decodeCompany(AESHelper.decryptString(constructionNodeCompanyVO.getCid(), SystemConfig.getString("encryptKey")));

	    List<ConstructionNodeCompanyPO> constructionNodeCompanyPOs = constructionNodeDao.queryConstructionNodeCompanyByCid(cid);
	    for (ConstructionNodeCompanyPO constructionNodeCompanyPO : constructionNodeCompanyPOs) {
	      constructionNodeDao.delete(constructionNodeCompanyPO);
	    }

	    for (Long cnid : cnids) {
	      ConstructionNodeCompanyPO constructionNodeCompanyPO = new ConstructionNodeCompanyPO();
	      constructionNodeCompanyPO.setCid(cid);
	      ConstructionNodePO constructionNodePO = constructionNodeDao.get(cnid);
	      constructionNodeCompanyPO.setConstructionNode(constructionNodePO);
	      constructionNodeDao.save(constructionNodeCompanyPO);
	    }
	  } catch (Exception e) {
	    throw new FLException(230015 , "公司不存在");
	  }
	}

}
