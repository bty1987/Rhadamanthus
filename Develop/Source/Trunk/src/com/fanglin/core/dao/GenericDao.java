package com.fanglin.core.dao;

/**
 * 
 * Title: 通用数据访问接口
 * Description: 本接口定义非泛型的通用的数据访问接口。 通过传入数据对象的类型，可以对特定的数据对象进行操作，满足通用的数据访问需求。
 * 该接口不限制访问的数据类型
 * @author WangChenggang
 * @version 1.0
 */

public interface GenericDao {
	
	public void save(Object obj);
	
	public void merge(Object obj);

	public void delete(Object obj);

	public void update(Object obj);

	public void refresh(Object obj);

	public void saveOrUpdate(Object obj);

	public void flush();

	public void clear();
	
}
