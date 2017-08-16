/**
 * @File Name		: ManifestTemplateServiceImpl.java
 * @Package   	: com.fanglin.inventory.service.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.ManifestTemplateDao;
import com.fanglin.inventory.dao.ManifestTemplateItemDao;
import com.fanglin.inventory.po.ManifestTemplatePO;
import com.fanglin.inventory.service.ManifestTemplateService;
import com.fanglin.inventory.vo.ManifestTemplateVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("manifestTemplateService")
@Transactional(readOnly=true)
public class ManifestTemplateServiceImpl implements ManifestTemplateService {
	
	@Autowired
	private ManifestTemplateDao manifestTemplateDao;
	
	@Autowired
	private ManifestTemplateItemDao manifestTemplateItemDao;

	@Override
	public void pageManifestTemplate(Paging paging, List<Filter> filters,int company) {
		
		List<ManifestTemplatePO> manifestTemplatePOs = manifestTemplateDao.pageManifestTemplate(paging, filters,company);
		List<ManifestTemplateVO> manifestTemplateVOs = new ArrayList<ManifestTemplateVO>();
		
		for(ManifestTemplatePO manifestTemplatePO: manifestTemplatePOs){
			ManifestTemplateVO manifestTemplateVO = new ManifestTemplateVO();
			
			BeanUtil.copyProperties(manifestTemplatePO, manifestTemplateVO);
			
			manifestTemplateVOs.add(manifestTemplateVO);
		}

		paging.setData(manifestTemplateVOs);
	}

	@Override
	public List<ManifestTemplateVO> queryManifestTemplate() {
		
		List<ManifestTemplatePO> manifestTemplatePOs = manifestTemplateDao.queryManifestTemplate();
		List<ManifestTemplateVO> manifestTemplateVOs = new ArrayList<ManifestTemplateVO>();
		
		for(ManifestTemplatePO manifestTemplatePO: manifestTemplatePOs){
			ManifestTemplateVO manifestTemplateVO = new ManifestTemplateVO();
			
			BeanUtil.copyProperties(manifestTemplatePO, manifestTemplateVO);
			
			manifestTemplateVOs.add(manifestTemplateVO);
		}
		
		return manifestTemplateVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestTemplate(ManifestTemplateVO manifestTemplateVO,int company) throws FLException {
		
		ManifestTemplatePO manifestTemplatePO = new ManifestTemplatePO();
		
		BeanUtil.copyProperties(manifestTemplateVO, manifestTemplatePO);
		
		manifestTemplatePO.setStatus(ManifestTemplatePO.STATUS_ENABLE_INT);
		manifestTemplatePO.setCompany(company);
		
		manifestTemplateDao.save(manifestTemplatePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateManifestTemplate(ManifestTemplateVO manifestTemplateVO) throws FLException {
		
		ManifestTemplatePO manifestTemplatePO = manifestTemplateDao.get(manifestTemplateVO.getMtId());
		
		if(manifestTemplatePO == null){
			throw new FLException(260001, "商品模版不存在");
		}
		
		manifestTemplatePO.setName(manifestTemplateVO.getName());
		manifestTemplatePO.setComment(manifestTemplateVO.getComment());
		
		manifestTemplateDao.update(manifestTemplatePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateManifestTemplateForStatus(ManifestTemplateVO manifestTemplateVO) throws FLException {
		
		ManifestTemplatePO manifestTemplatePO = manifestTemplateDao.get(manifestTemplateVO.getMtId());
		
		if(manifestTemplatePO == null){
			throw new FLException(260001, "商品模版不存在");
		}
		
		manifestTemplatePO.setStatus(manifestTemplateVO.getStatus());
		
		manifestTemplateDao.update(manifestTemplatePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteManifestTemplate(ManifestTemplateVO manifestTemplateVO) {
		
		long mtId = manifestTemplateVO.getMtId();
		
		manifestTemplateItemDao.deleteManifestTemplateItemByMtId(mtId);
		manifestTemplateDao.deleteById(mtId);
		
		return 0;
	}

}
