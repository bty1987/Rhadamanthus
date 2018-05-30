package com.fanglin.store.service;

import java.util.List;


import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.vo.AddressVO;

public interface  AddressService {

	public List<AddressVO> queryAddressByUid (AddressVO addressVO);
	
	public void addAddress(AddressVO  addressVO);
	
	public void updateAddress(AddressVO addressVO) throws FLException;
	
	public void updateAddressForStatus(AddressVO addressVO) throws FLException;
	
	public void deleteAddress(AddressVO addressVO) throws FLException;
	
}
