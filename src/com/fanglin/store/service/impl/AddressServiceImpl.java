package com.fanglin.store.service.impl;

import java.util.ArrayList;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.dao.AddressDao;
import com.fanglin.store.dao.MuserDao;
import com.fanglin.store.po.AddressPO;
import com.fanglin.store.po.MuserPO;
import com.fanglin.store.service.AddressService;
import com.fanglin.store.vo.AddressVO;
import com.fanglin.store.vo.MuserVO;

import com.fanglin.utils.BeanUtil;

@Service("addressService")
@Transactional(readOnly = true)
public class AddressServiceImpl implements AddressService {

	@Autowired
	private AddressDao addressDao;

	@Autowired
	private MuserDao muserDao;

	@Override
	public List<AddressVO> queryAddressByUid(AddressVO addressVO) {

		List<AddressPO> addressPOs = addressDao.queryAddressByUid(addressVO.getUid());
		
		List<AddressVO> addressVOs = new ArrayList<AddressVO>();

		AddressVO address;
		
		for (AddressPO addressPO : addressPOs) {
			
			address = new AddressVO();

			BeanUtil.copyProperties(addressPO, address);
			
			addressVOs.add(address);
			
		}

		return addressVOs;
		
	}

	//查询默认地址
	@Override
	public List<AddressVO> queryAddress(MuserVO muserVO, AddressVO  addressVO) {
		
		MuserPO muserPO = muserDao.queryMuserByUnionId(muserVO.getUnionId());
		
		List<AddressPO> addressPOs = addressDao.queryAddress(muserPO.getUid(), addressVO.getStatus());
		
		AddressVO address; 
		
		List<AddressVO> addressVOs = new ArrayList<AddressVO>();
		
		for (AddressPO addressPO : addressPOs) {
			
			address = new AddressVO();
			
			BeanUtil.copyProperties(addressPO, address);
			
			addressVOs.add(address);	
		}
		
		return addressVOs;	
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addAddress(AddressVO addressVO, MuserVO muserVO) throws FLException {

		MuserPO muserPO = muserDao.queryMuserByUnionId(muserVO.getUnionId());
		
		if(muserPO == null){
			throw new FLException(340009, "用户不存在");
		}
		
		List<AddressPO> addressPOs = addressDao.queryAddress(muserPO.getUid(), AddressPO.STATUS_DISABLE_SHORT);
		
		AddressPO addressPO = new AddressPO();
		
		addressPO.setUid(muserPO.getUid());
		
		BeanUtil.copyPropertie(addressVO, addressPO);
		
		if(addressPOs.size() == 0){
			addressPO.setStatus(AddressPO.STATUS_DEFAULT_SHORT);
		}
		
		addressDao.save(addressPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateAddress(AddressVO addressVO, MuserVO muserVO) throws FLException {
		
		AddressPO addressPO = addressDao.get(addressVO.getAid());
		
		if(addressPO == null){
			throw new FLException(340010, "地址不存在");
		}
		
		MuserPO muserPO = muserDao.queryMuserByUnionId(muserVO.getUnionId()); 

		if(muserPO == null){
			throw new FLException(340009, "用户不存在");
		}
		
		if(muserPO.getUid() != addressPO.getUid()){
			throw new FLException(340001, "无操作权限");
		}
		
		BeanUtil.copyPropertie(addressVO, addressPO, Arrays.asList("uid", "status"));
		
		addressDao.update(addressPO);

	}
	

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateAddressByAid(AddressVO addressVO) throws FLException {
		
		AddressPO addressPO = addressDao.get(addressVO.getAid());
		
		if(addressPO == null){
			throw new FLException(340010, "地址不存在");
		}
		
		BeanUtil.copyPropertie(addressVO, addressPO, Arrays.asList("uid", "status"));
		
		addressDao.update(addressPO);
		
	}	

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateAddressForStatus(AddressVO addressVO, MuserVO muserVO) throws FLException {
		
		AddressPO addressPO = addressDao.get(addressVO.getAid());
		
		if(addressPO == null){
			throw new FLException(340010, "地址不存在");
		}
		
		MuserPO muserPO = muserDao.queryMuserByUnionId(muserVO.getUnionId());
			
		if(muserPO == null){
			throw new FLException(340009, "用户不存在");	
		}
		
		if(muserPO.getUid() != addressPO.getUid()){
			throw new FLException(340001, "无操作权限");
		}
		
		if(addressVO.getStatus() == 1){
			
			addressDao.updateAddressByUid(muserPO.getUid());
			
		}
		
		if(addressVO.getStatus() == 2 && addressPO.getStatus() == 1){
			
			addressPO.setStatus(addressVO.getStatus());		
			
			List<AddressPO> addressPOs = addressDao.queryAddress(muserPO.getUid(), AddressPO.STATUS_DISABLE_SHORT);
			
			if(addressPOs.size() != 0){
				
				addressPOs.get(0).setStatus(AddressPO.STATUS_DEFAULT_SHORT);
				
			}
			
		}else{
			
			addressPO.setStatus(addressVO.getStatus());	
			
		}

		addressDao.update(addressPO);
			
	}	
}
