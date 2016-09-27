/**
 * @File Name		: MaterialSubOrderBalanceServiceImpl.java
 * @Package   	: com.fanglin.material.service.impl
 * @Version		: 1.0
 * @Date			: 2016-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.material.dao.MaterialSubOrderBalanceDao;
import com.fanglin.material.po.MaterialSubOrderBalancePO;
import com.fanglin.material.service.MaterialSubOrderBalanceService;
import com.fanglin.material.vo.MaterialSubOrderBalanceVO;
import com.fanglin.material.vo.MaterialSubOrderVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("materialSubOrderBalanceService")
@Transactional(readOnly=true)
public class MaterialSubOrderBalanceServiceImpl implements MaterialSubOrderBalanceService {
	
	@Autowired
	private MaterialSubOrderBalanceDao materialSubOrderBalanceDao;

	@Override
	public void pageMaterialSubOrderBalance(Paging paging, List<FilterVO> filters) {
		
		List<MaterialSubOrderBalancePO> materialSubOrderBalancePOs = materialSubOrderBalanceDao.pageMaterialSubOrderBalance(paging, filters);
		List<MaterialSubOrderBalanceVO> materialSubOrderBalanceVOs = new ArrayList<MaterialSubOrderBalanceVO>();
		
		MaterialSubOrderBalanceVO materialSubOrderBalanceVO;
		
		for(MaterialSubOrderBalancePO materialSubOrderBalancePO: materialSubOrderBalancePOs){
			
			materialSubOrderBalanceVO = new MaterialSubOrderBalanceVO(new MaterialSubOrderVO(), new UserVO());
			
			BeanUtil.copyProperties(materialSubOrderBalancePO, materialSubOrderBalanceVO, "materialSubOrder", "user");
			BeanUtil.copyProperties(materialSubOrderBalancePO.getMaterialSubOrder(), materialSubOrderBalanceVO.getMaterialSubOrder());
			
			materialSubOrderBalanceVO.getUser().setBaseInfo(materialSubOrderBalancePO.getUser());
			
			materialSubOrderBalanceVOs.add(materialSubOrderBalanceVO);
		}
		
		paging.setData(materialSubOrderBalanceVOs);
	}

}
