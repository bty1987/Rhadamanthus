/**
 * @File Name		: FunctionAreaServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-7-24
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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.FunctionAreaItemPO;
import com.fanglin.data.po.FunctionAreaPO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.FunctionAreaDao;
import com.fanglin.data.quotation.dao.FunctionAreaItemDao;
import com.fanglin.data.quotation.service.FunctionAreaService;
import com.fanglin.data.quotation.vo.FunctionAreaVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;


@Service("functionAreaService")
@Transactional(readOnly=true)
public class FunctionAreaServiceImpl implements FunctionAreaService {
	
	@Autowired
	private FunctionAreaDao functionAreaDao;
	
	@Autowired
	private FunctionAreaItemDao functionAreaItemDao;
	
	@Autowired
	private SystemConfigDao systemConfigDao;
	
	@Autowired
	private CountingService countingService;
	
	@Override
	public void pageFunctionArea(Paging paging, List<Filter> filters,int company){
		
		List<FunctionAreaPO> functionAreaPOs = functionAreaDao.pageFunctionArea(paging, filters,company);
		List<FunctionAreaVO> functionAreaVOs = new ArrayList<FunctionAreaVO>();
		
		for(FunctionAreaPO functionAreaPO: functionAreaPOs){
			FunctionAreaVO functionAreaVO = new FunctionAreaVO();
			BeanUtil.copyProperties(functionAreaPO, functionAreaVO);
			
			QuotationVersionPO quotationVersionPO = functionAreaPO.getQuotationVersion();
			
			functionAreaVO.setVersion(quotationVersionPO.getVersionName());
			functionAreaVO.setVersionId(quotationVersionPO.getVersionId());
			functionAreaVOs.add(functionAreaVO);
		}
		
		paging.setData(functionAreaVOs);
	}
	
	@Override
	public FunctionAreaVO queryFunctionAreaByIdAVersionId(FunctionAreaVO functionAreaVO) throws FLException{
		
		FunctionAreaPO functionAreaPO = functionAreaDao.queryFunctionAreaByIdAVersionId(functionAreaVO.getFunctionAreaId(), functionAreaVO.getVersionId());
		
		if(functionAreaPO == null){
			throw new FLException(200012, "功能区不存在");
		}
		
		QuotationVersionPO quotationVersionPO = functionAreaPO.getQuotationVersion();
		
		BeanUtil.copyProperties(functionAreaPO, functionAreaVO);
		functionAreaVO.setVersion(quotationVersionPO.getVersionName());
		functionAreaVO.setVersionId(quotationVersionPO.getVersionId());
		
		return functionAreaVO;
	}
	
	@Override
	public List<FunctionAreaVO> queryFunctionAreaByVersionId(FunctionAreaVO functionAreaVO) throws FLException{
		
		List<FunctionAreaPO> functionAreaPOs = functionAreaDao.queryFunctionAreaByVersionId(functionAreaVO.getVersionId());
		
		List<FunctionAreaVO> functionAreaVOs = new ArrayList<FunctionAreaVO>();
		
		for(FunctionAreaPO functionAreaPO: functionAreaPOs){
			FunctionAreaVO _functionAreaVO = new FunctionAreaVO();
			
			if(functionAreaPO == null){
				throw new FLException(200012, "功能区不存在");
			}
			
			QuotationVersionPO quotationVersionPO = functionAreaPO.getQuotationVersion();
			
			BeanUtil.copyProperties(functionAreaPO, _functionAreaVO);
			
			_functionAreaVO.setVersion(quotationVersionPO.getVersionName());
			_functionAreaVO.setVersionId(quotationVersionPO.getVersionId());
			
			functionAreaVOs.add(_functionAreaVO);
		}
		
		return functionAreaVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addFunctionArea(FunctionAreaVO functionAreaVO) throws FLException {
		
		FunctionAreaPO functionAreaPO = functionAreaDao.queryFunctionAreaByIdAVersionId(functionAreaVO.getFunctionAreaId(), functionAreaVO.getVersionId());
		
		if(functionAreaPO != null){
			throw new FLException(200020, "功能区对应版本和编号已存在");
		}
		
		functionAreaPO = new FunctionAreaPO();
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_QUOTATION_FUNCTION_AREA_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		
		StringBuffer functionAreaId = new StringBuffer();
		
		functionAreaId.append(systemConfigDao.querySystemConfig("quotationFunctionAreaIdent").getValue());
		functionAreaId.append(FormatUtil.fillZero(count, "000"));
		
		functionAreaPO.setFunctionAreaId(functionAreaId.toString());
		
		BeanUtil.copyProperties(functionAreaVO, functionAreaPO, Arrays.asList(new String[]{"functionAreaId"}));

		functionAreaPO.setQuotationVersion(new QuotationVersionPO(functionAreaVO.getVersionId()));
		
		functionAreaDao.saveOrUpdate(functionAreaPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateFunctionArea(FunctionAreaVO functionAreaVO) throws FLException {
		
		FunctionAreaPO functionAreaPO = functionAreaDao.get(functionAreaVO.getFaId());
		
		if(functionAreaPO == null){
			throw new FLException(200012, "功能区不存在");
		}
		
		if(!functionAreaPO.getFunctionAreaType().equals(functionAreaVO.getFunctionAreaType())){ // 功能区的类型改变时 清楚所包含的报价项
			functionAreaItemDao.deleteFunctionAreaItemByFunctionAreaId(functionAreaPO.getFaId());
		}
		
		BeanUtil.copyProperties(functionAreaVO, functionAreaPO, Arrays.asList(new String[]{"functionAreaId", "versionId"}));
		
		functionAreaDao.saveOrUpdate(functionAreaPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteFunctionAreaByIds(List<Long> ids){
		for(Long id: ids){
			List<FunctionAreaItemPO> functionAreaItemPOs = functionAreaItemDao.queryFunctionAreaItemByFunctionAreaId(id);
			
			for(FunctionAreaItemPO functionAreaItemPO: functionAreaItemPOs){
				functionAreaItemDao.delete(functionAreaItemPO);
			}
			
			functionAreaDao.deleteById(id);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteFunctionArea(FunctionAreaVO functionAreaVO){
		FunctionAreaPO functionAreaPO = new FunctionAreaPO();
		BeanUtil.copyProperties(functionAreaVO, functionAreaPO);
		
		functionAreaDao.delete(functionAreaPO);
	}

}
