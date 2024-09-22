package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceOalesItemDao;
import com.fanglin.balance.po.BalanceOalesItemPO;
import com.fanglin.balance.service.BalanceOalesItemService;
import com.fanglin.balance.vo.BalanceOalesItemVO;
import com.fanglin.balance.vo.BalanceOalesVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.vo.OalesVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("balanceOalesItemService")
@Transactional(readOnly = true)
public class BalanceOalesItemServiceImpl implements BalanceOalesItemService {

	@Autowired
	private BalanceOalesItemDao balanceOalesItemDao;

	@Override
	public void pageBalanceOalesItem(Paging paging, List<Filter> filters, long boid) {

		paging.setData(ptv(balanceOalesItemDao.pageBalanceOalesItem(paging, filters, boid)));
	}

	@Override
	public List<BalanceOalesItemVO> queryBalanceOalesItem(BalanceOalesItemVO balanceOalesItem) {

		return ptv(balanceOalesItemDao.queryBalanceOalesItem(balanceOalesItem.getBoid()));
	}

	@Override
	public int countBalanceOalesItem(BalanceOalesVO balanceOales) {

		return balanceOalesItemDao.countBalanceOalesItem(balanceOales.getBoid());
	}

	private List<BalanceOalesItemVO> ptv(List<BalanceOalesItemPO> balanceOalesItemPOs) {

		List<BalanceOalesItemVO> balanceOalesItemVOs = new ArrayList<BalanceOalesItemVO>();

		BalanceOalesItemVO balanceOalesItemVO;

		for (BalanceOalesItemPO balanceOalesItemPO : balanceOalesItemPOs) {

			balanceOalesItemVO = new BalanceOalesItemVO(new OalesVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO()));

			BeanUtil.copyProperties(balanceOalesItemPO, balanceOalesItemVO, Arrays.asList("oales"));

			balanceOalesItemPO.getOales().ptv(balanceOalesItemVO.getOales());

			balanceOalesItemVOs.add(balanceOalesItemVO);
		}

		return balanceOalesItemVOs;
	}

}
