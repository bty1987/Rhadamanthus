package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.AccessoriesDao;
import com.fanglin.inventory.dao.AccessoriesItemDao;
import com.fanglin.inventory.po.AccessoriesItemPO;
import com.fanglin.inventory.po.AccessoriesPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.service.AccessoriesItemService;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesTypeVO;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.utils.BeanUtil;

@Service("accessoriesItemService")
@Transactional(readOnly = true)
public class AccessoriesItemServiceImpl implements AccessoriesItemService {

	@Autowired
	private AccessoriesItemDao accessoriesItemDao;

	@Autowired
	private AccessoriesDao accessoriesDao;
	
	@Override
	public List<AccessoriesItemVO> queryAccessoriesItemByAid(AccessoriesItemVO accessoriesItemVO) {

		List<AccessoriesItemPO> accessoriesItemPOs = accessoriesItemDao.queryAccessoriesItemByAid(accessoriesItemVO.getAid());
		List<AccessoriesItemVO> accessoriesItemVOs = new ArrayList<AccessoriesItemVO>();

		for (AccessoriesItemPO accessoriesItemPO : accessoriesItemPOs) {

			accessoriesItemVO = new AccessoriesItemVO(new GoodsVO(new AccessoriesTypeVO(new WorkTypeVO())));

			BeanUtil.copyProperties(accessoriesItemPO, accessoriesItemVO,Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(accessoriesItemPO.getGoods(),accessoriesItemVO.getGoods(), Arrays.asList("accessoriesType"));
			
			if(accessoriesItemPO.getGoods().getAccessoriesType()!=null){
				
				BeanUtil.copyProperties(accessoriesItemPO.getGoods().getAccessoriesType(), accessoriesItemVO.getGoods().getAccessoriesType(),Arrays.asList("workType"));
				
				if(accessoriesItemPO.getGoods().getAccessoriesType().getWorkType()!=null){
					
					BeanUtil.copyProperties(accessoriesItemPO.getGoods().getAccessoriesType().getWorkType(), accessoriesItemVO.getGoods().getAccessoriesType().getWorkType());
					
				}
			}

			accessoriesItemVOs.add(accessoriesItemVO);
			
		}

		return accessoriesItemVOs;
	}

	@Override
	public List<AccessoriesItemVO> queryAccessoriesItemByAids(List<Long> aids) {
		
		List<AccessoriesItemPO> accessoriesItemPOs = accessoriesItemDao.queryAccessoriesItemByAids(aids);
		List<AccessoriesItemVO> accessoriesItemVOs = new ArrayList<AccessoriesItemVO>();
		
		for (AccessoriesItemPO accessoriesItemPO : accessoriesItemPOs) {

			AccessoriesItemVO accessoriesItemVO = new AccessoriesItemVO(new GoodsVO());

			BeanUtil.copyProperties(accessoriesItemPO, accessoriesItemVO,Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(accessoriesItemPO.getGoods(),accessoriesItemVO.getGoods(), Arrays.asList("accessoriesType"));

			accessoriesItemVOs.add(accessoriesItemVO);
		}

		return accessoriesItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAccessoriesItem(AccessoriesVO accessoriesVO,AccessoriesItemVO accessoriesItemVO) throws FLException {

		AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesVO.getAid());

		if (accessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		short stutas = accessoriesPO.getStatus();

		if (stutas != 0) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		AccessoriesItemPO accessoriesItemPO;

		accessoriesItemPO = new AccessoriesItemPO(new GoodsPO());

		BeanUtil.copyProperties(accessoriesItemVO, accessoriesItemPO,Arrays.asList("goods","color","format"));
		BeanUtil.copyProperties(accessoriesItemVO.getGoods(),accessoriesItemPO.getGoods(), Arrays.asList("accessoriesType"));

		accessoriesItemPO.setNum(accessoriesItemVO.getNum());
		accessoriesItemPO.setAid(accessoriesVO.getAid());

		accessoriesItemDao.save(accessoriesItemPO);

		accessoriesItemVO.setAiid(accessoriesItemPO.getAiid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAccessoriesItem(AccessoriesItemVO accessoriesItemVO) throws FLException {

		AccessoriesItemPO accessoriesItemPO = accessoriesItemDao.get(accessoriesItemVO.getAiid());
		
		if (accessoriesItemPO == null) {
			throw new FLException(260025, "辅料项不存在");
		}
		
		AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesItemPO.getAid());

		short stutas = accessoriesPO.getStatus();

		if (stutas != 0) {
			throw new FLException(260024, "辅料单状态不可操作");
		}
		
		accessoriesItemPO.setNum(accessoriesItemVO.getNum());

		accessoriesItemDao.update(accessoriesItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteAccessoriesItem(AccessoriesItemVO accessoriesItemVO) throws FLException {
		
		AccessoriesItemPO accessoriesItemPO = accessoriesItemDao.get(accessoriesItemVO.getAiid());

		if (accessoriesItemPO == null) {
			throw new FLException(260025, "辅料项不存在");
		}

		AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesItemPO.getAid());

		short stutas = accessoriesPO.getStatus();

		if (stutas != 0) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		accessoriesItemDao.delete(accessoriesItemPO);

		return 0;
	}

}
