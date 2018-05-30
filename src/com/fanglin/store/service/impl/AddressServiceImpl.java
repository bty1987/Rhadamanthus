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

		List<AddressPO> addressPOs = addressDao.queryAddressByUid(addressVO.getMuser().getUid());
		
		List<AddressVO> addressVOs = new ArrayList<AddressVO>();

		AddressVO address;
		
		for (AddressPO addressPO : addressPOs) {
			
			address = new AddressVO(new MuserVO());

			BeanUtil.copyProperties(addressPO, address, Arrays.asList("muser"));
			BeanUtil.copyProperties(addressPO.getMuser(), address.getMuser());

			addressVOs.add(address);
			
		}

		return addressVOs;
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addAddress(AddressVO addressVO) {

		MuserPO muserPO = muserDao.queryMuserByUnion(addressVO.getMuser().getUnionVal());
		
		AddressPO addressPO = new AddressPO(muserPO);
		
		BeanUtil.copyPropertie(addressVO, addressPO, Arrays.asList("muser"));
		
		addressDao.save(addressPO);
		
		addressVO.setAid(addressPO.getAid());

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateAddress(AddressVO addressVO) throws FLException {

		long aid = addressVO.getAid();
		
		AddressPO addressPO = addressDao.get(aid);
		
		if(addressPO == null){
			throw new FLException(111111, "地址不存在");
		}
		
		BeanUtil.copyPropertie(addressVO, addressPO, Arrays.asList("muser", "status"));
		
		addressDao.update(addressPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateAddressForStatus(AddressVO addressVO) throws FLException {

		addressDao.updateAddressByUid(addressVO.getMuser().getUid());

		AddressPO addressPO = addressDao.get(addressVO.getAid());
		
		if(addressPO == null){
			throw new FLException(111111, "地址不存在");
		}

		addressPO.setStatus(AddressPO.STATUS_DEFAULT_SHORT);

		addressDao.update(addressPO);

	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteAddress(AddressVO addressVO) throws FLException {
		
		AddressPO addressPO = addressDao.get(addressVO.getAid());
		
		if (addressPO == null) {
			throw new FLException(111111, "地址不存在");
		}
		
		addressPO.setStatus(AddressPO.STATUS_DISABLE_SHORT);
		
		addressDao.update(addressPO);
		
	}

}
