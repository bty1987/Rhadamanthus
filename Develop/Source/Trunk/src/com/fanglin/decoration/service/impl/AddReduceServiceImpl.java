/**
 * @File Name		: AddReduceServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-22
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

import com.fanglin.construction.dao.AddReduceDao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.dao.AddOrReduceDetailDao;
import com.fanglin.decoration.po.AddReducePO;
import com.fanglin.decoration.service.AddReduceService;
import com.fanglin.decoration.vo.AddReduceVO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("addReduceService")
@Transactional(readOnly=true)
public class AddReduceServiceImpl implements AddReduceService{
	
	@Autowired
	private AddReduceDao addReduceDao;
	
	@Autowired
	private AddOrReduceDetailDao addOrReduceDetailDao;
	
	@Autowired
	private DecorationPaymentDao decorationPaymentDao;
	
	@Override
	public void pageAddReduce(Paging paging, List<FilterVO> filters){
		
		List<AddReducePO> addReducePOs = addReduceDao.pageAddReduce(paging, filters);
		List<AddReduceVO> addReduceVOs = new ArrayList<AddReduceVO>();
		
		for(AddReducePO addReducePO: addReducePOs){
			AddReduceVO addReduceVO = new AddReduceVO();
			BeanUtil.copyProperties(addReducePO, addReduceVO);
			addReduceVOs.add(addReduceVO);
		}
		
		paging.setData(addReduceVOs);
	}

	@Override
	public void pageAddReduceByOrderId(Paging paging, List<FilterVO> filters, AddReduceVO addReduceVO){
		
		List<AddReducePO> addReducePOs = addReduceDao.pageAddReduceByOrderId(paging, filters, addReduceVO.getOrderId());
		List<AddReduceVO> addReduceVOs = new ArrayList<AddReduceVO>();
		
		for(AddReducePO addReducePO: addReducePOs){
			AddReduceVO _addReduceVO = new AddReduceVO();
			BeanUtil.copyProperties(addReducePO, _addReduceVO);
			addReduceVOs.add(_addReduceVO);
		}
		
		paging.setData(addReduceVOs);
	}
	
	@Override
	public List<AddReduceVO> queryAddReduceByOrderId(String orderId){
		
		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduceForNLeakageByOrderId(orderId);
		List<AddReduceVO> addReduceVOs = new ArrayList<AddReduceVO>();
		
		for(AddReducePO addReducePO: addReducePOs){
			AddReduceVO addReduceVO = new AddReduceVO();
			BeanUtil.copyProperties(addReducePO, addReduceVO);
			addReduceVOs.add(addReduceVO);
		}
		
		return addReduceVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateAddReduce(AddReduceVO addReduceVO){
		
		AddReducePO addReducePO = new AddReducePO();
		BeanUtil.copyProperties(addReduceVO, addReducePO);
		
		addReduceDao.saveOrUpdate(addReducePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateAddReduce(AddReduceVO addReduceVO){
		
		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());
		BeanUtil.copyProperties(addReduceVO, addReducePO);
		
		addReduceDao.saveOrUpdate(addReducePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteAddReduceById(int addReduceId){
		addReduceDao.deleteById(addReduceId);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteAddReduce(AddReduceVO addReduceVO){
		
		AddReducePO addReducePO = new AddReducePO();
		BeanUtil.copyProperties(addReduceVO, addReducePO);
		addReduceDao.delete(addReducePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public String deleteAddReduce(List<Integer> arIds){
		
		String result = "UNEXIST";
		
		List<Integer> unstatus = Arrays.asList(new Integer[]{AddReducePO.ADDREDUCESTATUS_UNSUBMIT_INT, AddReducePO.ADDREDUCESTATUS_SUBMIT_INT});
		
		for(Integer arId: arIds){
			
			AddReducePO addReducePO = addReduceDao.get(arId);
			
			if(addReducePO != null){
				
				if(!unstatus.contains(addReducePO.getAddReduceStatus())){
					result = "EXIST";
				}else{
					
					Long decorationPaymentId = addReducePO.getOrderPaymentId();
					
					if(decorationPaymentId != null){
						decorationPaymentDao.deleteById(decorationPaymentId);
					}
					
					addOrReduceDetailDao.deleteAddOrReduceDetailById(arId);
					addReduceDao.deleteById(arId);
				}
			}
		}
		
		return result;
	}

}