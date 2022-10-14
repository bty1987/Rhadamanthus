package com.fanglin.balance.service.impl;

import java.util.ArrayList;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceDetailDao;
import com.fanglin.balance.po.BalanceDetailPO;
import com.fanglin.balance.service.BalanceDetailService;
import com.fanglin.balance.vo.BalanceAccountVO;
import com.fanglin.balance.vo.BalanceDetailVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;


@Service("balanceDetailService")
@Transactional(readOnly = true)
public class BalanceDetailServiceImpl implements BalanceDetailService {

	@Autowired
	private BalanceDetailDao balanceDetailDao;

	@Override
	public List<BalanceDetailVO> queryBalanceDetailForBalance(BalanceDetailVO balanceDetailVO) {
		
		List<BalanceDetailVO> balanceDetailVOs = new ArrayList<BalanceDetailVO>();
		List<BalanceDetailPO> balanceDetailPOs = balanceDetailDao.queryBalanceDetailForBalance(balanceDetailVO.getBalance().getBid());
		
		for (BalanceDetailPO balanceDetailPO : balanceDetailPOs) {
			
			balanceDetailVO=new BalanceDetailVO(new BalanceAccountVO(new UserBaseVO(), new UserBaseVO()),new UserBaseVO());
			
			BeanUtil.copyProperties(balanceDetailPO, balanceDetailVO, Arrays.asList("account","operater","balance"));
			BeanUtil.copyProperties(balanceDetailPO.getAccount(), balanceDetailVO.getAccount(), Arrays.asList("belonger","creater"));
			BeanUtil.copyProperties(balanceDetailPO.getAccount().getBelonger(), balanceDetailVO.getAccount().getBelonger(), Arrays.asList("duty","dept"));
			BeanUtil.copyProperties(balanceDetailPO.getAccount().getCreater(), balanceDetailVO.getAccount().getCreater(), Arrays.asList("duty","dept"));
			BeanUtil.copyProperties(balanceDetailPO.getOperater(), balanceDetailVO.getOperater(), Arrays.asList("duty","dept"));
			
			balanceDetailVOs.add(balanceDetailVO);
		}
		
		return balanceDetailVOs;
	}


}
