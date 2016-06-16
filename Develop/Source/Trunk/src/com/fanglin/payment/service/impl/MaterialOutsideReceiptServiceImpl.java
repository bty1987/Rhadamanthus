/**
 * @File Name		: MaterialOutsideReceiptServiceImpl.java
 * @Package   	: com.fanglin.finance.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.payment.dao.MaterialOutsideReceiptDao;
import com.fanglin.payment.po.MaterialOutsideReceiptPO;
import com.fanglin.payment.service.MaterialOutsideReceiptService;
import com.fanglin.payment.vo.MaterialOutsideReceiptVO;
import com.fanglin.utils.BeanUtil;

@Service("materialOutsideReceiptService")
@Transactional(readOnly=true)
public class MaterialOutsideReceiptServiceImpl implements MaterialOutsideReceiptService {
	
	@Autowired
	private MaterialOutsideReceiptDao materialOutsideReceiptDao;
	
	@Override
	public List<MaterialOutsideReceiptVO> queryMaterialOutsideReceiptByMorIds(List<Long> morIds) {
		
		List<MaterialOutsideReceiptPO> materialOutsideReceiptPOs = materialOutsideReceiptDao.queryMaterialOutsideReceiptByMorIds(morIds);
		List<MaterialOutsideReceiptVO> materialOutsideReceiptVOs = new ArrayList<MaterialOutsideReceiptVO>();
		
		for(MaterialOutsideReceiptPO materialOutsideReceiptPO: materialOutsideReceiptPOs){
			MaterialOutsideReceiptVO materialOutsideReceiptVO = new MaterialOutsideReceiptVO();
			BeanUtil.copyProperties(materialOutsideReceiptPO, materialOutsideReceiptVO);
			
			materialOutsideReceiptVOs.add(materialOutsideReceiptVO);
		}
		
		return materialOutsideReceiptVOs;
	}

}
