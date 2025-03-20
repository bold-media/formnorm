import React from 'react'
import { TableBlockType } from '@payload-types'
import { RichText } from '../../RichText'

// export const TableBlock = (props: TableBlockType) => {
//   const { columns, rows = [], headerStyle = 'default' } = props

//   if (!columns || !rows?.length) {
//     return null
//   }

//   const headerRow = rows[0]
//   const dataRows = rows.slice(1)

//   const getHeaderClasses = () => {
//     if (headerStyle === 'dark') {
//       return 'bg-zinc-900 text-zinc-50'
//     }
//     return 'border-b border-zinc-200'
//   }

//   return (
//     <div className="w-full overflow-x-auto ">
//       <table className="min-w-full">
//         {/* <thead>
//           <tr className={getHeaderClasses()}>
//             {Object.values(headerRow)
//               .slice(1, 1 + columns)
//               .map((header, index) => (
//                 <th key={index} className="px-6 py-4 font-medium">
//                   <div>
//                     <RichText data={header as any} />
//                   </div>
//                 </th>
//               ))}
//           </tr>
//         </thead> */}
//         {withHeader && (
//           <thead>
//             {header}
//           </thead>
//         )}
//         <tbody>
//           {dataRows.map((row) => (
//             <tr
//               key={row.id}
//               className={
//                 headerStyle === 'default'
//                   ? 'border-b border-zinc-200 mt-12'
//                   : 'border-b border-zinc-200'
//               }
//             >
//               {Object.values(row)
//                 .slice(1, 1 + columns)
//                 .map((data, index) => (
//                   <td key={index} className=" px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <RichText data={data as any} />
//                     </div>
//                   </td>
//                 ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

export const TableBlock = (props: TableBlockType) => {
  const {
    columns,
    rows = [],
    withHeader = false,
    headerColOne,
    headerColTwo,
    headerColThree,
    headerColFour,
    headerColFive,
  } = props

  if (!columns || !rows?.length) {
    return null
  }

  const dataRows = rows
  const headerCells = [headerColOne, headerColTwo, headerColThree, headerColFour, headerColFive]
    .filter(Boolean)
    .slice(0, columns)

  return (
    <div className="relative w-full">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200">
          {withHeader && headerCells.length > 0 && (
            <thead>
              <tr>
                {headerCells.map((headerText, index) => (
                  <th
                    key={index}
                    className={`
                      px-6 py-5 bg-zinc-900 text-zinc-50 font-semibold
                      text-sm md:text-base align-top
                      ${
                        index === 0
                          ? 'sticky left-0 z-10 bg-zinc-900 max-w-[40vw] md:max-w-none'
                          : ''
                      }
                    `}
                  >
                    <div className="whitespace-normal">{headerText as string}</div>
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-zinc-200 ">
            {dataRows.map((row) => (
              <tr key={row.id}>
                {Object.values(row)
                  .slice(1, 1 + columns)
                  .map((data, index) => (
                    <td
                      key={index}
                      className={`
                        px-6 py-5
                        not-prose 
                        ${
                          index === 0
                            ? 'sticky left-0 z-10 bg-white max-w-[40vw] md:max-w-none '
                            : ''
                        }
                        ${
                          withHeader === true
                            ? 'md:border-r last:border-r-0 '
                            : 'pt-5 pb-3 border-r-0'
                        }
                      `}
                    >
                      <div className="whitespace-normal">
                        <RichText
                          data={data as any}
                          className="text-sm md:text-base leading-tight"
                        />
                      </div>
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
