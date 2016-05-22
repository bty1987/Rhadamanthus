package com.fanglin.core.dao;

import java.io.Serializable;
import java.util.List;

/**
 * Title：指定泛型的数据访问接口
 * Description：本接口定义指定泛型的通用的数据访问接口。 通过已经指定的泛型类型，可以对特定类型的数据对象进行操作，满足通用的数据访问需求。
 * 推荐使用该接口访问的指定泛型的数据对象，非该泛型的数据对象建议使用GenericDao访问
 */

public interface Dao<T> extends GenericDao {

	public T get(Serializable id);

	public void deleteById(Serializable id);

	public List<T> list();

}
