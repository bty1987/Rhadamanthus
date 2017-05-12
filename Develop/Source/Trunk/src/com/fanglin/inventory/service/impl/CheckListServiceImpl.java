/**
 * @File Name		: CheckListServiceImpl.java
 * @Package   	: com.fanglin.inventory.service.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.CheckListDao;
import com.fanglin.inventory.po.CheckListPO;
import com.fanglin.inventory.service.CheckListService;
import com.fanglin.inventory.vo.CheckListVO;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.inventory.vo.StorehouseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("checkListService")
@Transactional(readOnly=true)
public class CheckListServiceImpl implements CheckListService {
	
	@Autowired
	private CheckListDao checkListDao;
	
	@Override
	public void pageCheckList(Paging paging, List<Filter> filters) {
		
		List<CheckListPO> checkListPOs = checkListDao.pageCheckList(paging, filters);
		List<CheckListVO> checkListVOs = new ArrayList<CheckListVO>();
		
		CheckListVO checkListVO;
		
		for(CheckListPO checkListPO: checkListPOs){
			
			checkListVO = new CheckListVO(new GoodsVO(), new ColorVO(), new FormatVO(), new StorehouseVO(), new UserVO());
			
			BeanUtil.copyProperties(checkListPO, checkListVO, "goods", "color","format","storehouse", "createUser");
			BeanUtil.copyProperties(checkListPO.getGoods(), checkListVO.getGoods(),Arrays.asList("assisType"));
			BeanUtil.copyProperties(checkListPO.getColor(), checkListVO.getColor());
			BeanUtil.copyProperties(checkListPO.getFormat(), checkListVO.getFormat());
			BeanUtil.copyProperties(checkListPO.getStorehouse(), checkListVO.getStorehouse());
			
			checkListVO.getCreateUser().setBaseInfo(checkListPO.getCreateUser());
			
			checkListVOs.add(checkListVO);
		}

		paging.setData(checkListVOs);
	}

}
