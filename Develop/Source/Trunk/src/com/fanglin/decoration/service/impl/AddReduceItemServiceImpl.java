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
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.AddReduceDao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.decoration.dao.AddReduceItemDao;
import com.fanglin.decoration.po.AddReduceItemPO;
import com.fanglin.decoration.po.AddReducePO;
import com.fanglin.decoration.service.AddReduceItemService;
import com.fanglin.decoration.vo.AddReduceItemVO;
import com.fanglin.decoration.vo.AddReduceVO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.utils.BeanUtil;

@Service("addReduceItemService")
@Transactional(readOnly=true)
public class AddReduceItemServiceImpl implements AddReduceItemService {
	
	@Autowired
	private AddReduceDao addReduceDao;
	
	@Autowired
	private AddReduceItemDao addReduceItemDao;

	@Override
	public List<AddReduceItemVO> queryAddReduceItemByAddReduceId(AddReduceVO addReduceVO) {
		
		List<AddReduceItemPO> addReduceItemPOs = addReduceItemDao.queryAddReduceItemByAddReduceId(addReduceVO.getArId());
		List<AddReduceItemVO> addReduceItemVOs = new ArrayList<AddReduceItemVO>();
		
		for(AddReduceItemPO addReduceItemPO: addReduceItemPOs){
			
			AddReduceItemVO addReduceItemVO = new AddReduceItemVO();
			
			BeanUtil.copyProperties(addReduceItemPO, addReduceItemVO);
			
			if(addReduceItemPO.getQuotationItem() != null){
				addReduceItemVO.setContent(addReduceItemPO.getQuotationItem().getQuotationItemDes());
			}
			
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
				
				if(addReduceItemPO.getQuotationItem() != null){
					addReduceItemVO.setContent(addReduceItemPO.getQuotationItem().getQuotationItemDes());
				}
				
				addReduceItemVOs.add(addReduceItemVO);
			}
		}
		
		return addReduceItemVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateAddReduceItem(AddReduceVO addReduceVO, AddReduceItemVO addReduceItemVO) throws FLException {
		
		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());
		
		if(addReducePO == null){
			throw new FLException(140018, "增减项不存在");
		}
		
		AddReduceServiceImpl.convertAddReduceVOToPOForAdvance(addReduceVO, addReducePO);
		
		AddReduceItemPO addReduceItemPO = null;
		
		if(addReduceItemVO.getAriId() == null){
			addReduceItemPO = new AddReduceItemPO();
			
			BeanUtil.copyProperties(addReduceItemVO, addReduceItemPO);
			
			addReduceItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(addReduceItemVO.getQuotationFunctionAreaId()));
			
			if(addReduceItemVO.getQuotationItemId() != null){
				addReduceItemPO.setQuotationItem(new QuotationItemPO(addReduceItemVO.getQuotationItemId()));
			}
		}else{
			addReduceItemPO = addReduceItemDao.get(addReduceItemVO.getAriId());
			
			if(addReduceItemPO == null){
				throw new FLException(140036, "增减项目不存在");
			}
			
			addReduceItemPO.setNum(addReduceItemVO.getNum());
		}
		
		addReduceItemDao.saveOrUpdate(addReduceItemPO);
		addReduceDao.update(addReducePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteAddReduceItem(AddReduceVO addReduceVO, AddReduceItemVO addReduceItemVO) throws FLException {
		
		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());
		
		if(addReducePO == null){
			throw new FLException(140018, "增减项不存在");
		}
		
		AddReduceServiceImpl.convertAddReduceVOToPOForAdvance(addReduceVO, addReducePO);
		
		addReduceItemDao.deleteById(addReduceItemVO.getAriId());
		addReduceDao.update(addReducePO);
		
		return 0;
	}

}
