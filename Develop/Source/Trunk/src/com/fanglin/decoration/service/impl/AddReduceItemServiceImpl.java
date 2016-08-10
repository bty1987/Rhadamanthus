/**
 * @File Name		: AddReduceItemServiceImpl.java
 * @Package   	: com.fanglin.decoration.service.impl
 * @Version		: 1.0
 * @Date			: 2016-6-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.SystemDefineItemPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.dao.SystemDefineItemDao;
import com.fanglin.decoration.dao.AddReduceDao;
import com.fanglin.decoration.dao.AddReduceItemDao;
import com.fanglin.decoration.po.AddReduceItemPO;
import com.fanglin.decoration.po.AddReducePO;
import com.fanglin.decoration.service.AddReduceItemService;
import com.fanglin.decoration.vo.AddReduceItemVO;
import com.fanglin.decoration.vo.AddReduceVO;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;

@Service("addReduceItemService")
@Transactional(readOnly=true)
public class AddReduceItemServiceImpl implements AddReduceItemService {
	
	@Autowired
	private AddReduceDao addReduceDao;
	
	@Autowired
	private AddReduceItemDao addReduceItemDao;
	
	@Autowired
	private QuotationItemDao quotationItemDao;
	
	@Autowired
	private SystemDefineItemDao systemDefineItemDao;
	
	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Override
	public List<AddReduceItemVO> queryAddReduceItemByAddReduceId(AddReduceVO addReduceVO) {
		
		List<AddReduceItemPO> addReduceItemPOs = addReduceItemDao.queryAddReduceItemByAddReduceId(addReduceVO.getArId());
		List<AddReduceItemVO> addReduceItemVOs = new ArrayList<AddReduceItemVO>();
		
		for(AddReduceItemPO addReduceItemPO: addReduceItemPOs){
			
			AddReduceItemVO addReduceItemVO = new AddReduceItemVO();
			
			BeanUtil.copyProperties(addReduceItemPO, addReduceItemVO);
			
			short addReduceItemType = addReduceItemPO.getType();
			
			if(addReduceItemType == AddReduceItemPO.TYPE_COMMON_QUOTATION_INT){
				QuotationItemPO quotationItemPO = quotationItemDao.get(addReduceItemPO.getQuoteItemId());
				
				if(quotationItemPO != null){
					addReduceItemVO.setContent(quotationItemPO.getQuotationItemDes());
				}
			}else if(addReduceItemType == AddReduceItemPO.TYPE_SYSTEM_QUOTATION_INT){
				SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.get(addReduceItemPO.getQuoteItemId());
				
				if(systemDefineItemPO != null){
					addReduceItemVO.setContent(systemDefineItemPO.getQuotationItemDes());
				}
			}else if(addReduceItemType == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT){
				QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.get(addReduceItemPO.getQuoteItemId());
				
				if(quotationFunctionAreaItemPO != null){
					if(quotationFunctionAreaItemPO.getQuotationItem() != null){
						addReduceItemVO.setContent(quotationFunctionAreaItemPO.getQuotationItem().getQuotationItemDes());;
					}else{
						addReduceItemVO.setContent(quotationFunctionAreaItemPO.getContent());
					}
				}else{
					addReduceItemVO.setContent("报价项已被删除");
				}
			}
			
			QuotationFunctionAreaPO quotationFunctionAreaPO = addReduceItemPO.getQuotationFunctionArea();
			
			addReduceItemVO.setQuotationFunctionAreaId(quotationFunctionAreaPO.getQfaId());
			addReduceItemVO.setQuotationFunctionAreaName(quotationFunctionAreaPO.getFunctionAreaName());
			
			addReduceItemVOs.add(addReduceItemVO);
		}
		
		return addReduceItemVOs;
	}

	@Override
	public List<AddReduceItemVO> queryAddReduceItemByAddReduceIds(List<Integer> addReduceIds) {
		
		List<AddReduceItemVO> addReduceItemVOs = new ArrayList<AddReduceItemVO>();
		
		if(addReduceIds != null && addReduceIds.size() > 0){
			List<AddReduceItemPO> addReduceItemPOs = addReduceItemDao.queryAddReduceItemByAddReduceIds(addReduceIds);
			
			for(AddReduceItemPO addReduceItemPO: addReduceItemPOs){
				
				AddReduceItemVO addReduceItemVO = new AddReduceItemVO();
				
				BeanUtil.copyProperties(addReduceItemPO, addReduceItemVO);
				
				short addReduceItemType = addReduceItemPO.getType();
				
				if(addReduceItemType == AddReduceItemPO.TYPE_COMMON_QUOTATION_INT){
					QuotationItemPO quotationItemPO = quotationItemDao.get(addReduceItemPO.getQuoteItemId());
					if(quotationItemPO != null){
						addReduceItemVO.setContent(quotationItemPO.getQuotationItemDes());
					}
				}else if(addReduceItemType == AddReduceItemPO.TYPE_SYSTEM_QUOTATION_INT){
					SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.get(addReduceItemPO.getQuoteItemId());
					
					if(systemDefineItemPO != null){
						addReduceItemVO.setContent(systemDefineItemPO.getQuotationItemDes());
					}
				}else if(addReduceItemType == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT){
					QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.get(addReduceItemPO.getQuoteItemId());
					
					if(quotationFunctionAreaItemPO != null){
						if(quotationFunctionAreaItemPO.getQuotationItem() != null){
							addReduceItemVO.setContent(quotationFunctionAreaItemPO.getQuotationItem().getQuotationItemDes());;
						}else{
							addReduceItemVO.setContent(quotationFunctionAreaItemPO.getContent());
						}
					}else{
						addReduceItemVO.setContent("报价项已被删除");
					}
				}
				
				QuotationFunctionAreaPO quotationFunctionAreaPO = addReduceItemPO.getQuotationFunctionArea();
				
				addReduceItemVO.setQuotationFunctionAreaId(quotationFunctionAreaPO.getQfaId());
				addReduceItemVO.setQuotationFunctionAreaName(quotationFunctionAreaPO.getFunctionAreaName());
				
				addReduceItemVOs.add(addReduceItemVO);
			}
		}
		
		return addReduceItemVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateAddReduceItem(AddReduceVO addReduceVO, AddReduceItemVO addReduceItemVO) throws FLException {
		
		List<Integer> statuses = Arrays.asList(AddReducePO.STATUS_UNSUBMIT_INT, AddReducePO.STATUS_SUBMIT_INT);
		
		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());
		
		if(addReducePO == null){
			throw new FLException(140018, "增减项不存在");
		}
		
		if(!statuses.contains(addReducePO.getStatus())){
			throw new FLException(140035, "当前增减项款项状态不可操作");
		}
		
		AddReduceServiceImpl.convertAddReduceVOToPOForAdvance(addReduceVO, addReducePO);
		
		AddReduceItemPO addReduceItemPO = null;
		
		if(addReduceItemVO.getAriId() == null){
			
			if(addReduceItemVO.getType() != AddReduceItemPO.TYPE_CUSTOM_QUOTATION_INT && addReduceItemVO.getQuoteItemId() == null){
				throw new FLException(140038, "非自定义增减项目需要引用项");
			}
			
			addReduceItemPO = new AddReduceItemPO();
			
			BeanUtil.copyProperties(addReduceItemVO, addReduceItemPO);
			
			addReduceItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(addReduceItemVO.getQuotationFunctionAreaId()));
			
			if(addReduceItemPO.getType() == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT){
				QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.get(addReduceItemPO.getQuoteItemId());
				
				if(quotationFunctionAreaItemPO == null){
					throw new FLException(200013, "报价项不存在");
				}
				
				float quotationFunctionAreaItemNum = quotationFunctionAreaItemPO.getNum();
				float addReduceItemNum = addReduceItemPO.getNum();
				
				if(quotationFunctionAreaItemNum < addReduceItemNum){
					throw new FLException(140039, "减项工程量大于引用项目");
				}
				
//				quotationFunctionAreaItemPO.setNum(Arith.sub(quotationFunctionAreaItemNum, addReduceItemNum));
//				quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
			}
		}else{
			addReduceItemPO = addReduceItemDao.get(addReduceItemVO.getAriId());
			
			if(addReduceItemPO == null){
				throw new FLException(140036, "增减项目不存在");
			}
			
			if(addReduceItemPO.getType() == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT){
				QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.get(addReduceItemPO.getQuoteItemId());
				
				if(quotationFunctionAreaItemPO == null){
					throw new FLException(200013, "报价项不存在");
				}
				
				float quotationFunctionAreaItemNum = quotationFunctionAreaItemPO.getNum();
				float addReduceItemNum = addReduceItemPO.getNum();
				float _num = addReduceItemVO.getNum();
				
				float _diff = Arith.sub(_num, addReduceItemNum);
				
				if(_diff > 0 && quotationFunctionAreaItemNum < _diff){
					throw new FLException(140039, "减项工程量大于引用项目");
				}
				
//				quotationFunctionAreaItemPO.setNum(Arith.sub(quotationFunctionAreaItemNum, _diff));
//				quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
			}
			
			addReduceItemPO.setNum(addReduceItemVO.getNum());
		}
		
		addReduceItemDao.saveOrUpdate(addReduceItemPO);
		addReduceDao.update(addReducePO);
		
		addReduceItemVO.setAriId(addReduceItemPO.getAriId());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteAddReduceItem(AddReduceVO addReduceVO, AddReduceItemVO addReduceItemVO) throws FLException {
		
		List<Integer> statuses = Arrays.asList(AddReducePO.STATUS_UNSUBMIT_INT, AddReducePO.STATUS_SUBMIT_INT);
		
		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());
		
		if(addReducePO == null){
			throw new FLException(140018, "增减项不存在");
		}
		
		if(!statuses.contains(addReducePO.getStatus())){
			throw new FLException(140035, "当前增减项款项状态不可操作");
		}
		
		AddReduceItemPO addReduceItemPO = addReduceItemDao.get(addReduceItemVO.getAriId());
		
		if(addReduceItemPO == null){
			throw new FLException(140036, "增减项目不存在");
		}
		
		if(addReduceItemPO.getType() == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT){
			QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.get(addReduceItemPO.getQuoteItemId());
			
			if(quotationFunctionAreaItemPO == null){
				throw new FLException(200013, "报价项不存在");
			}
			
//			float quotationFunctionAreaItemNum = quotationFunctionAreaItemPO.getNum();
//			float addReduceItemNum = addReduceItemPO.getNum();
			
//			quotationFunctionAreaItemPO.setNum(Arith.add(quotationFunctionAreaItemNum, addReduceItemNum));
//			quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
		}
		
		AddReduceServiceImpl.convertAddReduceVOToPOForAdvance(addReduceVO, addReducePO);
		
		addReduceItemDao.delete(addReduceItemPO);
		addReduceDao.update(addReducePO);
		
		return 0;
	}

}
