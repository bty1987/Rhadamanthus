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

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.quotation.dao.QuotationVersionDao;
import com.fanglin.quotation.po.QuotationVersionPO;
import com.fanglin.quotation.service.QuotationVersionService;
import com.fanglin.quotation.vo.QuotationVersionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("quotationVersionService")
@Transactional(readOnly=true)
public class QuotationVersionServiceImpl implements QuotationVersionService {
	
	protected Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private QuotationVersionDao quotationVersionDao;
	
	@Autowired
	private CountingService countingService;
	
	@Override
	public void pageQuotationVersion(Paging paging, List<FilterVO> filters){
		
		List<QuotationVersionPO> quotationVersionPOs = quotationVersionDao.pageQuotationVersion(paging, filters);
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
	public List<QuotationVersionVO> queryQuotationVersion(){
		
		List<QuotationVersionPO> quotationVersionPOs = quotationVersionDao.queryQuotationVersion();
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
	public void saveQuotationVersion(QuotationVersionVO quotationVersionVO){
		
		QuotationVersionPO quotationVersionPO = null;
		
		if(quotationVersionVO.getDefaultFlag() == 1){
			List<QuotationVersionPO> defaultFlagQuotationVersionPOs = quotationVersionDao.queryQuotationVersionByDefaultFlag(1);
			
			for(QuotationVersionPO _quotationVersionPO: defaultFlagQuotationVersionPOs){
				_quotationVersionPO.setDefaultFlag(0);
				quotationVersionDao.update(_quotationVersionPO);
			}
			
			BeanUtil.copyProperties(quotationVersionVO, quotationVersionPO, Arrays.asList(new String[]{"versionId"}));
			
			//级联更新订单状态是咨询和量房 已报价的订单 使用的报价版本
			//quotationVersionDao.changeRelationTable(quotationVersionPO.getVersionId());
		}else{
			quotationVersionPO = new QuotationVersionPO();
			
			BeanUtil.copyProperties(quotationVersionVO, quotationVersionPO, Arrays.asList(new String[]{"versionId"}));
		}
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_QUOTATION_VERSION_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		
		StringBuffer versionId = new StringBuffer();
		versionId.append(SystemConfig.getString("companyIdent", ""));
		versionId.append(SystemConfig.getString("quotationVersionIdent", "QV_"));
		versionId.append(FormatUtil.fillZero(count, "000"));
		
		quotationVersionPO.setVersionId(versionId.toString());
		
		quotationVersionDao.save(quotationVersionPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateQuotationVersion(QuotationVersionVO quotationVersionVO){
		
		QuotationVersionPO sourceQuotationVersionPO = quotationVersionDao.get(quotationVersionVO.getVersionId());
		
		if(quotationVersionVO.getDefaultFlag() == 1){
			List<QuotationVersionPO> defaultFlagQuotationVersionPOs = quotationVersionDao.queryQuotationVersionByDefaultFlag(1);
			
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
	public void copyQuotationVersion(QuotationVersionVO quotationVersionVO, String sourceVersionId) throws FLException{
		
		QuotationVersionPO quotationVersionPO = quotationVersionDao.get(sourceVersionId);
		
		if(quotationVersionPO == null){
			
			StringBuffer errorInfo = new StringBuffer();
			errorInfo.append("报价版本(");
			errorInfo.append(sourceVersionId);
			errorInfo.append(")已存在");
			
			throw new FLException(200016, errorInfo.toString());
		}
		
		quotationVersionPO = new QuotationVersionPO();
		BeanUtil.copyProperties(quotationVersionVO, quotationVersionPO);
		quotationVersionPO.setDefaultFlag(0);
		
		quotationVersionDao.saveOrUpdate(quotationVersionPO);
		
		// 复制对应报价版本的所有报价项
		// quotationItemDao.copyQuotaitonItem(sourceVersionId, quotationVersionPO.getVersionId());
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
