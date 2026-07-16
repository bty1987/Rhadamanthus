package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.dao.WalletDao;
import com.fanglin.payment.dao.WalletardDao;
import com.fanglin.payment.po.WalletPO;
import com.fanglin.payment.po.WalletardPO;
import com.fanglin.payment.service.WalletardService;
import com.fanglin.payment.vo.WalletardVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("walletardService")
@Transactional(readOnly = true)
public class WalletardServiceImpl implements WalletardService {
	
	@Autowired
	private WalletardDao walletardDao;
	
	@Autowired
	private WalletDao walletDao;

	@Override
	public List<WalletardVO> queryWalletard(WalletardVO walletard) {
		List<WalletardPO> walletardPOs = walletardDao.queryWalletard(walletard.getWid());
		List<WalletardVO> walletardVOs = new ArrayList<WalletardVO>();
		
		WalletardVO walletardVO = null;
		
		for (WalletardPO walletardPO : walletardPOs) {
			walletardVO = new WalletardVO();
			BeanUtil.copyProperties(walletardPO, walletardVO);
			walletardVOs.add(walletardVO);
		}
		
		return walletardVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public WalletardVO bindWalletard(WalletardVO walletard) throws FLException {
		
		WalletPO walletPO = walletDao.get(walletard.getWid());
		
		if (walletPO == null) {
			throw new FLException(150054, "钱包不存在");
		}
		
		WalletardPO walletardPO = new WalletardPO();
		
		BeanUtil.copyProperties(walletard, walletardPO);
		//TODO 获取 token & sn & validCode
		walletardPO.setToken("token");
		walletardPO.setBindTime(DateUtil.getDateToTimestamp(new Date()));
		
		walletardDao.save(walletardPO);
		
		//TODO 获取sn
		String sn = "";
		walletard.setSn(sn);
		
		return walletard;
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmWalletard(WalletardVO walletard) throws FLException {
		
		WalletardPO walletardPO = walletardDao.get(walletard.getWcid());
		
		if (walletardPO == null) {
			throw new FLException(150058, "银行卡不存在");
		}
		
		List<Short> status = Arrays.asList(WalletardPO.STATUS_INIT_INT, WalletardPO.STATUS_UNBIND_INT);
		
		if (!status.contains(walletardPO.getStatus())) {
			throw new FLException(150059, "银行卡状态不可操作");
		}
		
		//TODO 获取sn
		String sn = "";
		walletard.setSn(sn);
		
		walletardDao.update(walletardPO);
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void unbindWalletard(WalletardVO walletard) throws FLException {
		
		WalletardPO walletardPO = walletardDao.get(walletard.getWcid());
		
		if (walletardPO == null) {
			throw new FLException(150058, "银行卡不存在");
		}
		
		if (walletardPO.getStatus() != WalletardPO.STATUS_ABLE_INT) {
			throw new FLException(150094, "银行卡状态不可操作");
		}
		
		walletardPO.setStatus(WalletardPO.STATUS_UNBIND_INT);
		
		walletardDao.update(walletardPO);
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteWalletard(WalletardVO walletard) throws FLException {
		
		WalletardPO walletardPO = walletardDao.get(walletard.getWcid());
		
		if (walletardPO == null) {
			throw new FLException(150058, "银行卡不存在");
		}
		
		List<Short> status = Arrays.asList(WalletardPO.STATUS_INIT_INT, WalletardPO.STATUS_UNBIND_INT);
		
		if (!status.contains(walletardPO.getStatus())) {
			throw new FLException(150094, "银行卡状态不可操作");
		}
		
		walletardDao.delete(walletardPO);
		
	}

}
