/**
 * @File Name		: MaterialReceiptServiceImpl.java
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
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.dao.MaterialReceiptDao;
import com.fanglin.payment.po.MaterialReceiptPO;
import com.fanglin.payment.service.MaterialReceiptService;
import com.fanglin.payment.vo.MaterialReceiptVO;
import com.fanglin.utils.BeanUtil;

@Repository("materialReceiptService")
@Transactional(readOnly=true)
public class MaterialReceiptServiceImpl implements MaterialReceiptService {
	
	@Autowired
	private MaterialReceiptDao materialReceiptDao;
	
	@Override
	public MaterialReceiptVO queryMaterialReceiptByMrId(MaterialReceiptVO materialReceiptVO) throws FLException {
		
		MaterialReceiptPO materialReceiptPO = materialReceiptDao.get(materialReceiptVO.getMrId());
		
		if(materialReceiptPO == null){
			throw new FLException(150026, "收据不存在");
		}
		
		BeanUtil.copyProperties(materialReceiptPO, materialReceiptVO);
		
		return materialReceiptVO;
	}

	@Override
	public List<MaterialReceiptVO> queryMaterialReceiptByMrIds(List<Long> mrIds) {
		
		List<MaterialReceiptPO> materialReceiptPOs = materialReceiptDao.queryMaterialReceiptByMrIds(mrIds);
		List<MaterialReceiptVO> materialReceiptVOs = new ArrayList<MaterialReceiptVO>();
		
		for(MaterialReceiptPO materialReceiptPO: materialReceiptPOs){
			MaterialReceiptVO materialReceiptVO = new MaterialReceiptVO();
			BeanUtil.copyProperties(materialReceiptPO, materialReceiptVO);

			materialReceiptVOs.add(materialReceiptVO);
		}
		
		return materialReceiptVOs;
	}

}
