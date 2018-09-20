package com.fanglin.quotation.service.impl;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.dao.QuotetionDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaItemDao;
import com.fanglin.quotation.po.QuotetionFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotetionFunctionAreaPO;
import com.fanglin.quotation.po.QuotetionPO;
import com.fanglin.quotation.service.QuotetionFunctionAreaItemService;
import com.fanglin.quotation.vo.QuotetionFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotetionFunctionAreaVO;
import com.fanglin.quotation.vo.QuotetionVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.utils.BeanUtil;

@Service("quotetionFunctionAreaItemService")
@Transactional(readOnly=true)
public class QuotetionFunctionAreaItemServiceImpl implements QuotetionFunctionAreaItemService {

	@Autowired
	private QuotetionDao quotetionDao;
	
	@Autowired
	private QuotetionFunctionAreaItemDao quotetionFunctionAreaItemDao;

	@Autowired
	private QuotetionFunctionAreaDao quotetionFunctionAreaDao;
	
	@Autowired
	private SystemConfigDao systemConfigDao;
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public QuotetionFunctionAreaItemVO updateQuotetionFunctionAreaItem( QuotetionFunctionAreaItemVO quotetionFunctionAreaItemVO, QuotetionVO quotetionVO) throws FLException {
		
		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());
		
		QuotetionServiceImpl.convertQuotetionVOToPOForAdvance(quotetionVO, quotetionPO);
		
		Long qfaiId = quotetionFunctionAreaItemVO.getQfaiId();
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());

		if(qfaiId != null){
		
			QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemByQfaiId( QuotetionFunctionAreaItemPO.factoryToClazz(quotetionFunctionAreaItemVO.getQfaid(), divisor), qfaiId);
			
			if(quotetionFunctionAreaItemPO == null){
				throw new FLException(200013, "报价项不存在");
			}
			quotetionFunctionAreaItemPO.setFormula(quotetionFunctionAreaItemVO.getFormula());
			quotetionFunctionAreaItemPO.setNum(quotetionFunctionAreaItemVO.getNum());
			quotetionFunctionAreaItemDao.update(quotetionFunctionAreaItemPO);
		}else{

			QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO = QuotetionFunctionAreaItemPO.factoryToInstance(quotetionFunctionAreaItemVO.getQfaid(), divisor);
			
			BeanUtil.copyProperties(quotetionFunctionAreaItemVO, quotetionFunctionAreaItemPO);
			
			if(quotetionFunctionAreaItemVO.getType() == 0 || quotetionFunctionAreaItemVO.getType() == 4){
				quotetionFunctionAreaItemPO.setQiid(quotetionFunctionAreaItemVO.getQiid());
				quotetionFunctionAreaItemPO.setContent(null);
			}else{
				quotetionFunctionAreaItemPO.setContent(quotetionFunctionAreaItemVO.getContent());
			}
			quotetionFunctionAreaItemDao.save(quotetionFunctionAreaItemPO);
			
			quotetionFunctionAreaItemVO.setQfaiId(quotetionFunctionAreaItemPO.getQfaiId());
		}

		quotetionDao.update(quotetionPO);
		
		return quotetionFunctionAreaItemVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotetionFunctionAreaItemForIndex(List<QuotetionFunctionAreaItemVO> quotetionFunctionAreaItemVOs, QuotetionFunctionAreaVO quotetionFunctionAreaVO) throws FLException {
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
		
		String table= QuotetionFunctionAreaItemPO.quotetionFunctionAreaItemTable(quotetionFunctionAreaVO.getQfaId(), divisor);
		
		for(QuotetionFunctionAreaItemVO quotetionFunctionAreaItemVO : quotetionFunctionAreaItemVOs){
			quotetionFunctionAreaItemDao.updateQuotetionFunctionAreaItemForIndex(table,quotetionFunctionAreaItemVO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotetionFunctionAreaItemForSpec( QuotetionFunctionAreaItemVO quotetionFunctionAreaItemVO, QuotetionVO quotetionVO) throws FLException {
	
		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());
		
		QuotetionServiceImpl.convertQuotetionVOToPOForAdvance(quotetionVO, quotetionPO);
		
		List<Short> types = Arrays.asList(QuotetionFunctionAreaItemPO.TYPE_QUOTATION_COMMON_SHORT, QuotetionFunctionAreaItemPO.TYPE_QUOTATION_CUSTOMER_SHORT,QuotetionFunctionAreaItemPO.TYPE_QUOTATION_FIX_SHORT);
		
		QuotetionFunctionAreaPO quotetionFunctionAreaPO = quotetionFunctionAreaDao.queryQuotetionFunctionAreaForTypeByQuotetionId(quotetionVO.getQid(),QuotetionFunctionAreaPO.TYPE_MANAGEMENT_INT);
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
		
		QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemByQfaiId(QuotetionFunctionAreaItemPO.factoryToClazz(quotetionFunctionAreaPO.getQfaId(), divisor),quotetionFunctionAreaItemVO.getQfaiId());
																								
		if(quotetionFunctionAreaItemPO == null){
			throw new FLException(200013, "报价项不存在");
		}
		
		short type = quotetionFunctionAreaItemPO.getType();
		
		if(!types.contains(type)){
			
			quotetionFunctionAreaItemPO.setUnitPrice(quotetionFunctionAreaItemVO.getUnitPrice());
			
			quotetionFunctionAreaItemDao.update(quotetionFunctionAreaItemPO);
			
			quotetionDao.update(quotetionPO);
		}
	
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteQuotetionFunctionAreaItem(List<Long> qfaiIds, QuotetionVO quotetionVO, QuotetionFunctionAreaVO quotetionFunctionAreaVO) throws FLException {
		
		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());
		
		QuotetionFunctionAreaPO quotetionFunctionAreaPO = quotetionFunctionAreaDao.get(quotetionFunctionAreaVO.getQfaId());
		
		if(quotetionFunctionAreaPO == null){
			throw new FLException(200012, "功能区不存在");
		}
		
		QuotetionServiceImpl.convertQuotetionVOToPOForAdvance(quotetionVO, quotetionPO);
		
		if(qfaiIds != null && qfaiIds.size() > 0){
			
			Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
			
			String tableName = QuotetionFunctionAreaItemPO.quotetionFunctionAreaItemTable(quotetionFunctionAreaPO.getQfaId(),divisor);

			quotetionFunctionAreaItemDao.deleteQuotetionFunctionAreaItemByQfaiIds(tableName,qfaiIds);
		}
		
		quotetionDao.update(quotetionPO);
		
		return 0;
	}
	
	private QuotetionPO checkQuotetionForStatusByEnabled(Long qid)throws FLException{
		
		QuotetionPO quotetionPO = quotetionDao.get(qid);
		
		if(quotetionPO == null){
			throw new FLException(200003 , "报价不存在");
		}
		
		return quotetionPO;
	}

}
