package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.vo.AddressVO;
import com.fanglin.store.vo.MuserVO;

public interface AddressService {

	public List<AddressVO> queryAddressByUid(AddressVO addressVO);

	public List<AddressVO> queryAddress(MuserVO muserVO, AddressVO addressVO);

	public int addAddress(AddressVO addressVO, MuserVO muserVO) throws FLException;

	public int updateAddress(AddressVO addressVO, MuserVO muserVO) throws FLException;

	public int updateAddressByAid(AddressVO addressVO) throws FLException;

	public int updateAddressForStatus(AddressVO addressVO, MuserVO muserVO) throws FLException;

}
