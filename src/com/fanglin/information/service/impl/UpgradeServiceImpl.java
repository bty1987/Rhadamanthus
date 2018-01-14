package com.fanglin.information.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.UpgradeDao;
import com.fanglin.information.po.UpgradePO;
import com.fanglin.information.service.UpgradeService;
import com.fanglin.information.vo.UpgradeVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("upgradeService")
@Transactional(readOnly = true)
public class UpgradeServiceImpl implements UpgradeService {

	@Autowired
	private UpgradeDao upgradeDao;
	
	@Override
	public void pageUpgrade(Paging paging, List<Filter> filters) {
		List<UpgradePO> upgradePOs = upgradeDao.pageUpgrade(paging, filters);
		List<UpgradeVO> upgradeVOs = new ArrayList<UpgradeVO>();
		
		UpgradeVO upgradeVO;
		
		for(UpgradePO upgradePO: upgradePOs){
			
			upgradeVO = new UpgradeVO();
			
			BeanUtil.copyProperties(upgradePO, upgradeVO);
			
			upgradeVOs.add(upgradeVO);
		}

		paging.setData(upgradeVOs);
		
	}

	@Override
	public List<UpgradeVO> queryUpgrade(List<Filter> filters,UpgradeVO upgradeVO) {

		List<UpgradePO> upgradePOs = upgradeDao.queryUpgrade(filters);
		List<UpgradeVO> upgradeVOs = new ArrayList<UpgradeVO>();
		
		for (UpgradePO upgradePO : upgradePOs) {
			
			if(upgradePO.getNo().compareTo(upgradeVO.getTrialno())>0){
				
				UpgradeVO upgrade = new UpgradeVO();
				
				BeanUtil.copyProperties(upgradePO, upgrade);
				
				upgradeVOs.add(upgrade);
			}
		}

		return upgradeVOs;
	}
	
	@Override
	public UpgradeVO matchUpgrade(UpgradeVO upgradeVO) {
		
		List<UpgradePO> upgradePOs = upgradeDao.matchUpgrade(upgradeVO.getTrialno());
		
		if(upgradePOs.size()!=0){
			
			Collections.sort(upgradePOs, new Comparator<UpgradePO>() {
				@Override
				public int compare(UpgradePO upgrade1, UpgradePO upgrade2) {
					
					String upgradeNumber1 = upgrade1.getNo();
					String upgradeNumber2 = upgrade2.getNo();
					
					return upgradeNumber2.compareTo(upgradeNumber1);
				}
				
			});
			
			UpgradePO upgradePO = upgradePOs.get(0);
			BeanUtil.copyProperties(upgradePO, upgradeVO);
		}
	
		return upgradeVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addUpgrade(UpgradeVO upgradeVO) throws FLException{
		
		List<UpgradePO> upgradePOs = upgradeDao.matchUpgrade(upgradeVO.getNo());
		
		for(UpgradePO upgradePO : upgradePOs){
			
			if(upgradePO.getNo().equals(upgradeVO.getNo()) && upgradePO.getTrialno().equals(upgradeVO.getTrialno())){
				
				throw new FLException(300001, "版本已存在");
				
			}
			
		}
		
		UpgradePO upgradePO = new UpgradePO();
		
		BeanUtil.copyProperties(upgradeVO, upgradePO);
		
		upgradeDao.save(upgradePO);
		
		return 0; 
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteUpgrade(UpgradeVO upgradeVO) throws FLException {
		
		UpgradePO upgradePO = upgradeDao.get(upgradeVO.getUgid());
		
		if(upgradePO == null){
			throw new FLException(300002,"版本不存在");
		}
		
		upgradeDao.delete(upgradePO);
		
		return 0;
	}

}
