/**
 * @File Name		: QuotationVersionServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.data.quotation.service.QuotationVersionService;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("quotationVersionService")
@Transactional(readOnly=true)
public class QuotationVersionServiceImpl implements QuotationVersionService {
	
	@Autowired
	private QuotationVersionDao quotationVersionDao;
	
	@Autowired
	private CountingService countingService;
	
	@Override
	public void pageQuotationVersion(Paging paging, List<Filter> filters,int company){
		
		List<QuotationVersionPO> quotationVersionPOs = quotationVersionDao.pageQuotationVersion(paging, filters,company);
		List<QuotationVersionVO> quotationVersionVOs = new ArrayList<QuotationVersionVO>();
		
		for(QuotationVersionPO quotationVersionPO: quotationVersionPOs){
			QuotationVersionVO quotationVersionVO = new QuotationVersionVO();
			BeanUtil.copyProperties(quotationVersionPO, quotationVersionVO);
			
			quotationVersionVOs.add(quotationVersionVO);
		}
		
		paging.setData(quotationVersionVOs);
	}
	
	@Override
	public QuotationVersionVO queryQuotationVersionById(QuotationVersionVO quotationVersionVO){

		QuotationVersionPO quotationVersionPO = quotationVersionDao.get(quotationVersionVO.getVersionId());
		
		BeanUtil.copyProperties(quotationVersionPO, quotationVersionVO);
		
		return quotationVersionVO;
	}
	
	@Override
	public List<QuotationVersionVO> queryQuotationVersion(int company){
		
		List<QuotationVersionPO> quotationVersionPOs = quotationVersionDao.queryQuotationVersion(company);
		List<QuotationVersionVO> quotationVersionVOs = new ArrayList<QuotationVersionVO>();
		
		for(QuotationVersionPO quotationVersionPO: quotationVersionPOs){
			QuotationVersionVO quotationVersionVO = new QuotationVersionVO();
			BeanUtil.copyProperties(quotationVersionPO, quotationVersionVO);
			
			quotationVersionVOs.add(quotationVersionVO);
		}
		
		return quotationVersionVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveQuotationVersion(QuotationVersionVO quotationVersionVO,int company){
		
		if(quotationVersionVO.getDefaultFlag() == 1){
			List<QuotationVersionPO> defaultFlagQuotationVersionPOs = quotationVersionDao.queryQuotationVersionByDefaultFlag(company,1);
			if(!defaultFlagQuotationVersionPOs.isEmpty()){
				for(QuotationVersionPO _quotationVersionPO: defaultFlagQuotationVersionPOs){
					_quotationVersionPO.setDefaultFlag(0);
					quotationVersionDao.update(_quotationVersionPO);
				}
			}
		}
		
		QuotationVersionPO quotationVersionPO = new QuotationVersionPO();
			
		BeanUtil.copyProperties(quotationVersionVO, quotationVersionPO, Arrays.asList(new String[]{"versionId"}));
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_QUOTATION_VERSION_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		
		StringBuffer versionId = new StringBuffer();
		versionId.append(SystemConfig.getString("companyIdent", ""));
		versionId.append(SystemConfig.getString("quotationVersionIdent", "QV_"));
		versionId.append(FormatUtil.fillZero(count, "000"));
		quotationVersionPO.setVersionId(versionId.toString());
		quotationVersionPO.setCompany(company);
		quotationVersionDao.save(quotationVersionPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateQuotationVersion(QuotationVersionVO quotationVersionVO){
		
		QuotationVersionPO sourceQuotationVersionPO = quotationVersionDao.get(quotationVersionVO.getVersionId());
		
		if(quotationVersionVO.getDefaultFlag() == 1){
			List<QuotationVersionPO> defaultFlagQuotationVersionPOs = quotationVersionDao.queryQuotationVersionByDefaultFlag(sourceQuotationVersionPO.getCompany(),1);
			
			for(QuotationVersionPO quotationVersionPO: defaultFlagQuotationVersionPOs){
				quotationVersionPO.setDefaultFlag(0);
				quotationVersionDao.update(quotationVersionPO);
			}
			
			BeanUtil.copyProperties(quotationVersionVO, sourceQuotationVersionPO, Arrays.asList("qvId"));
			
			quotationVersionDao.saveOrUpdate(sourceQuotationVersionPO);
			
			//级联更新订单状态是咨询和量房 已报价的订单 使用的报价版本
			//quotationVersionDao.changeRelationTable(sourceQuotationVersionPO.getVersionId());
		}else{
			BeanUtil.copyProperties(quotationVersionVO, sourceQuotationVersionPO, Arrays.asList("qvId"));
			
			quotationVersionDao.update(sourceQuotationVersionPO);
		}
	}
	
	
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteQuotationVersion(QuotationVersionVO quotationVersionVO){
		
		QuotationVersionPO quotationVersionPO = new QuotationVersionPO();
		BeanUtil.copyProperties(quotationVersionVO, quotationVersionPO);
		
		quotationVersionDao.delete(quotationVersionPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteQuotationVersionById(String id){
		quotationVersionDao.deleteById(id);
	}

}
