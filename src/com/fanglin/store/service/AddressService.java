package com.fanglin.store.service;

import java.util.List;


import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.vo.AddressVO;
import com.fanglin.store.vo.MuserVO;

public interface  AddressService {

	public List<AddressVO> queryAddressByUid (AddressVO addressVO);
	
	public List<AddressVO> queryAddress(MuserVO muserVO, AddressVO  addressVO);
	
	public void addAddress(AddressVO  addressVO, MuserVO muserVO) throws FLException;
	
	public void updateAddress(AddressVO addressVO, MuserVO muserVO) throws FLException;
	
	public void updateAddressByAid(AddressVO addressVO) throws FLException;
	
	public void updateAddressForStatus(AddressVO addressVO, MuserVO muserVO) throws FLException;
	
}
