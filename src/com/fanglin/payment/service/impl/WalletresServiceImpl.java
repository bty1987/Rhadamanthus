package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.dao.WalletDao;
import com.fanglin.payment.dao.WalletresDao;
import com.fanglin.payment.po.WalletPO;
import com.fanglin.payment.po.WalletresPO;
import com.fanglin.payment.service.WalletresService;
import com.fanglin.payment.vo.WalletresVO;
import com.fanglin.utils.BeanUtil;

@Service("walletresService")
@Transactional(readOnly = true)
public class WalletresServiceImpl implements WalletresService {
	
	@Autowired
	private WalletresDao walletresDao;
	
	@Autowired
	private WalletDao walletDao;

	@Override
	public List<WalletresVO> queryWalletres(WalletresVO walletres) {
		
		List<WalletresPO> walletresPOs = walletresDao.queryWalletres(walletres.getWid());
		List<WalletresVO> walletresVOs = new ArrayList<WalletresVO>();
		
		for (WalletresPO walletresPO : walletresPOs) {
			
			WalletresVO walletresVO = new WalletresVO();
			
			BeanUtil.copyProperties(walletresPO, walletresVO);
			
			walletresVOs.add(walletresVO);
			
		}
		
		return walletresVOs;
	}

	@Override
	public void uploadWalletres(WalletresVO walletres) throws FLException {
		
		WalletPO walletPO = walletDao.get(walletres.getWid());
		
		if (walletPO == null) {
			throw new FLException(150054, "钱包不存在");
		}
		
		WalletresPO walletresPO = new WalletresPO();
		
		BeanUtil.copyProperties(walletres, walletresPO);
		
		//TODO picid需要获取赋值
		walletresPO.setPicid(0);
		
		walletresDao.save(walletresPO);

	}

	@Override
	public void deleteWalletres(WalletresVO walletres) {
		
		WalletresPO walletresPO = walletresDao.get(walletres.getWrid());
		
		walletresDao.delete(walletresPO);

	}

}
